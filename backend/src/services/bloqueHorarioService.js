import { pool } from "../config/db.js";

// Este archivo es el único que habla con la base de datos para los bloques horarios:
// aquí están todas las consultas SQL de buscar, crear, editar y borrar.

// Datos que se devuelven de cada bloque, incluidos los cupos que aún quedan libres
const columnasBloqueHorario = `
  b.id_bloque_horario,
  b.fecha,
  b.hora_inicio,
  b.hora_fin,
  b.cupos,
  b.activo,
  b.cupos - count(c.id_cita)::int as cupos_disponibles`;

// Datos de un bloque que se pueden crear o modificar desde la API
export const columnasEditables = ["fecha", "hora_inicio", "hora_fin", "cupos", "activo"];

// Busca los bloques horarios, opcionalmente filtrados por fecha o por si están activos, ordenados por fecha y hora
export async function buscarBloquesHorarios({ fecha, activo }) {
  const { rows } = await pool.query(
    `select ${columnasBloqueHorario}
     from bloque_horario b
     left join cita c on c.id_bloque_horario = b.id_bloque_horario and c.vigente
     where ($1::date is null or b.fecha = $1)
       and ($2::boolean is null or b.activo = $2)
     group by b.id_bloque_horario
     order by b.fecha, b.hora_inicio`,
    [fecha ?? null, activo ?? null],
  );
  return rows;
}

// Busca un bloque horario por su id; si no existe, no devuelve nada
export async function buscarBloqueHorarioPorId(idBloqueHorario) {
  const { rows } = await pool.query(
    `select ${columnasBloqueHorario}
     from bloque_horario b
     left join cita c on c.id_bloque_horario = b.id_bloque_horario and c.vigente
     where b.id_bloque_horario = $1
     group by b.id_bloque_horario`,
    [idBloqueHorario],
  );
  return rows[0];
}

// Guarda un bloque horario nuevo y devuelve el bloque recién creado
export async function insertarBloqueHorario({ fecha, hora_inicio, hora_fin, cupos, activo = true }) {
  const { rows } = await pool.query(
    `insert into bloque_horario (fecha, hora_inicio, hora_fin, cupos, activo)
     values ($1, $2, $3, $4, $5)
     returning id_bloque_horario`,
    [fecha, hora_inicio, hora_fin, cupos, activo],
  );
  return buscarBloqueHorarioPorId(rows[0].id_bloque_horario);
}

// Reemplaza todos los datos de un bloque horario; si el bloque no existe, no devuelve nada
export async function reemplazarBloqueHorario(idBloqueHorario, { fecha, hora_inicio, hora_fin, cupos, activo = true }) {
  const { rowCount } = await pool.query(
    `update bloque_horario
     set fecha = $1, hora_inicio = $2, hora_fin = $3, cupos = $4, activo = $5
     where id_bloque_horario = $6`,
    [fecha, hora_inicio, hora_fin, cupos, activo, idBloqueHorario],
  );
  return rowCount === 0 ? undefined : buscarBloqueHorarioPorId(idBloqueHorario);
}

// Cambia solo los datos indicados de un bloque horario; si el bloque no existe, no devuelve nada
export async function actualizarCamposBloqueHorario(idBloqueHorario, camposNuevos) {
  // Solo se aceptan campos conocidos, para que nadie pueda colar texto extraño en la consulta
  const nombresCampos = Object.keys(camposNuevos).filter((nombreCampo) =>
    columnasEditables.includes(nombreCampo),
  );
  const asignaciones = nombresCampos.map((nombreCampo, indice) => `${nombreCampo} = $${indice + 1}`);
  const valores = nombresCampos.map((nombreCampo) => camposNuevos[nombreCampo]);

  const { rowCount } = await pool.query(
    `update bloque_horario
     set ${asignaciones.join(", ")}
     where id_bloque_horario = $${nombresCampos.length + 1}`,
    [...valores, idBloqueHorario],
  );
  return rowCount === 0 ? undefined : buscarBloqueHorarioPorId(idBloqueHorario);
}

// Borra un bloque horario y devuelve los datos que tenía; si no existía, no devuelve nada
export async function borrarBloqueHorario(idBloqueHorario) {
  const { rows } = await pool.query(
    `delete from bloque_horario
     where id_bloque_horario = $1
     returning id_bloque_horario, fecha, hora_inicio, hora_fin, cupos, activo`,
    [idBloqueHorario],
  );
  return rows[0];
}

// Cuenta cuántas citas tiene un bloque horario; puede contar solo las vigentes o también las canceladas
export async function contarCitasDelBloqueHorario(idBloqueHorario, { soloVigentes }) {
  const { rows } = await pool.query(
    `select count(*)::int as cantidad_citas
     from cita
     where id_bloque_horario = $1 and ($2 = false or vigente)`,
    [idBloqueHorario, soloVigentes],
  );
  return rows[0].cantidad_citas;
}
