import { pool } from "../config/db.js";

// Este archivo es el único que habla con la base de datos para las citas:
// aquí están todas las consultas SQL de buscar, reservar, editar y borrar citas.

// Datos que se devuelven de cada cita, con el RUT del ciudadano, el horario del bloque y el método de notificación
const columnasCita = `
  c.id_cita,
  c.fecha_reserva,
  c.vigente,
  c.id_tramite,
  t.rut_ciudadano,
  c.id_bloque_horario,
  b.fecha,
  b.hora_inicio,
  b.hora_fin,
  c.id_metodo_notificacion,
  m.nombre_metodo_notificacion`;

// Tablas que se unen para obtener esos datos
const tablasCita = `
  cita c
  join tramite t on t.id_tramite = c.id_tramite
  join bloque_horario b on b.id_bloque_horario = c.id_bloque_horario
  join metodo_notificacion m on m.id_metodo_notificacion = c.id_metodo_notificacion`;

// Datos de una cita que se pueden crear o modificar desde la API
export const columnasCreacion = ["id_tramite", "id_bloque_horario", "id_metodo_notificacion"];
export const columnasEditables = ["id_bloque_horario", "id_metodo_notificacion", "vigente"];

// Busca las citas, opcionalmente filtradas por fecha del bloque, RUT del ciudadano, bloque o si están vigentes,
// ordenadas por fecha y hora del bloque
export async function buscarCitas({ fecha, rut_ciudadano, id_bloque_horario, vigente }) {
  const { rows } = await pool.query(
    `select ${columnasCita}
     from ${tablasCita}
     where ($1::date is null or b.fecha = $1)
       and ($2::varchar is null or t.rut_ciudadano = $2)
       and ($3::int is null or c.id_bloque_horario = $3)
       and ($4::boolean is null or c.vigente = $4)
     order by b.fecha, b.hora_inicio, c.id_cita`,
    [fecha ?? null, rut_ciudadano ?? null, id_bloque_horario ?? null, vigente ?? null],
  );
  return rows;
}

// Busca una cita por su id; si no existe, no devuelve nada
export async function buscarCitaPorId(idCita) {
  const { rows } = await pool.query(
    `select ${columnasCita}
     from ${tablasCita}
     where c.id_cita = $1`,
    [idCita],
  );
  return rows[0];
}

// Revisa si se puede reservar en un bloque y devuelve el motivo si no se puede (o null si todo está bien).
// Bloquea la fila del bloque hasta que termine la transacción, para que dos personas no tomen el último cupo a la vez.
async function revisarBloqueParaReservar(cliente, idBloqueHorario) {
  const { rows } = await cliente.query(
    `select
       b.activo,
       b.fecha < current_date as ya_paso,
       b.cupos - (select count(*) from cita where id_bloque_horario = b.id_bloque_horario and vigente)::int as cupos_disponibles
     from bloque_horario b
     where b.id_bloque_horario = $1
     for update`,
    [idBloqueHorario],
  );
  const bloqueHorario = rows[0];
  if (!bloqueHorario) return "bloque_inexistente";
  if (!bloqueHorario.activo) return "bloque_inactivo";
  if (bloqueHorario.ya_paso) return "bloque_pasado";
  if (bloqueHorario.cupos_disponibles <= 0) return "sin_cupos";
  return null;
}

// Reserva una cita nueva en un bloque, solo si el bloque existe, está activo, no ha pasado y le quedan cupos.
// Devuelve { cita } si se reservó, o { motivoRechazo } con la razón por la que no se pudo.
export async function reservarCita({ id_tramite, id_bloque_horario, id_metodo_notificacion }) {
  const cliente = await pool.connect();
  try {
    await cliente.query("begin");
    const motivoRechazo = await revisarBloqueParaReservar(cliente, id_bloque_horario);
    if (motivoRechazo) {
      await cliente.query("rollback");
      return { motivoRechazo };
    }
    const { rows } = await cliente.query(
      `insert into cita (id_tramite, id_bloque_horario, id_metodo_notificacion)
       values ($1, $2, $3)
       returning id_cita`,
      [id_tramite, id_bloque_horario, id_metodo_notificacion],
    );
    await cliente.query("commit");
    return { cita: await buscarCitaPorId(rows[0].id_cita) };
  } catch (error) {
    await cliente.query("rollback");
    throw error;
  } finally {
    cliente.release();
  }
}

// Cambia los datos indicados de una cita (sirve para PUT y PATCH): reagendar a otro bloque, cambiar cómo se notifica
// o cancelarla con vigente = false. Si la cita queda vigente en un bloque nuevo (o se reactiva), revisa que ese bloque tenga cupo.
// Devuelve { cita } si se actualizó, o { motivoRechazo } con la razón por la que no se pudo.
export async function actualizarCita(idCita, camposNuevos) {
  // Solo se aceptan campos conocidos, para que nadie pueda colar texto extraño en la consulta
  const nombresCampos = Object.keys(camposNuevos).filter((nombreCampo) =>
    columnasEditables.includes(nombreCampo),
  );
  const asignaciones = nombresCampos.map((nombreCampo, indice) => `${nombreCampo} = $${indice + 1}`);
  const valores = nombresCampos.map((nombreCampo) => camposNuevos[nombreCampo]);

  const cliente = await pool.connect();
  try {
    await cliente.query("begin");
    // Se lee cómo está la cita ahora y se bloquea su fila hasta terminar
    const { rows } = await cliente.query(
      `select id_bloque_horario, vigente from cita where id_cita = $1 for update`,
      [idCita],
    );
    const citaActual = rows[0];
    if (!citaActual) {
      await cliente.query("rollback");
      return { motivoRechazo: "cita_inexistente" };
    }

    // Así quedaría la cita después del cambio
    const idBloqueHorarioFinal = camposNuevos.id_bloque_horario ?? citaActual.id_bloque_horario;
    const quedaVigente = camposNuevos.vigente ?? citaActual.vigente;
    const ocupaCupoNuevo =
      quedaVigente && (idBloqueHorarioFinal !== citaActual.id_bloque_horario || !citaActual.vigente);

    if (ocupaCupoNuevo) {
      const motivoRechazo = await revisarBloqueParaReservar(cliente, idBloqueHorarioFinal);
      if (motivoRechazo) {
        await cliente.query("rollback");
        return { motivoRechazo };
      }
    }

    await cliente.query(
      `update cita
       set ${asignaciones.join(", ")}
       where id_cita = $${nombresCampos.length + 1}`,
      [...valores, idCita],
    );
    await cliente.query("commit");
    return { cita: await buscarCitaPorId(idCita) };
  } catch (error) {
    await cliente.query("rollback");
    throw error;
  } finally {
    cliente.release();
  }
}

// Borra una cita y devuelve los datos que tenía; si no existía, no devuelve nada
export async function borrarCita(idCita) {
  const cita = await buscarCitaPorId(idCita);
  if (!cita) return undefined;
  await pool.query(`delete from cita where id_cita = $1`, [idCita]);
  return cita;
}
