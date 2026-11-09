import { pool } from "../config/db.js";

// Este archivo es el único que habla con la base de datos para los trámites:
// aquí están todas las consultas SQL de buscar, crear, editar y borrar trámites y su historial de estados.

// Estado con el que parte todo trámite nuevo (1 = "Cita reservada" en el catálogo estado_tramite)
const idEstadoInicial = 1;

// Datos que se devuelven de cada trámite, con los nombres del ciudadano, del tipo y del estado
const columnasTramite = `
  t.id_tramite,
  t.fecha_inicio,
  t.rut_ciudadano,
  u.nombre as nombre_ciudadano,
  t.id_tipo_tramite,
  tt.nombre_tipo_tramite,
  t.id_estado_tramite,
  et.nombre_estado_tramite`;

// Tablas que se unen para obtener esos nombres
const tablasTramite = `
  tramite t
  join usuario u on u.rut = t.rut_ciudadano
  join tipo_tramite tt on tt.id_tipo_tramite = t.id_tipo_tramite
  join estado_tramite et on et.id_estado_tramite = t.id_estado_tramite`;

// Datos de un trámite que se pueden crear o modificar desde la API
export const columnasCreacion = ["rut_ciudadano", "id_tipo_tramite"];
export const columnasEditables = ["id_tipo_tramite", "id_estado_tramite"];

// Busca los trámites, opcionalmente filtrados por RUT del ciudadano, tipo o estado, del más nuevo al más antiguo
export async function buscarTramites({ rut_ciudadano, id_tipo_tramite, id_estado_tramite }) {
  const { rows } = await pool.query(
    `select ${columnasTramite}
     from ${tablasTramite}
     where ($1::varchar is null or t.rut_ciudadano = $1)
       and ($2::int is null or t.id_tipo_tramite = $2)
       and ($3::int is null or t.id_estado_tramite = $3)
     order by t.fecha_inicio desc, t.id_tramite desc`,
    [rut_ciudadano ?? null, id_tipo_tramite ?? null, id_estado_tramite ?? null],
  );
  return rows;
}

// Busca un trámite por su id; si no existe, no devuelve nada
export async function buscarTramitePorId(idTramite) {
  const { rows } = await pool.query(
    `select ${columnasTramite}
     from ${tablasTramite}
     where t.id_tramite = $1`,
    [idTramite],
  );
  return rows[0];
}

// Devuelve los cambios de estado de un trámite, del más antiguo al más nuevo
export async function buscarHistorialDelTramite(idTramite) {
  const { rows } = await pool.query(
    `select h.id_historial_estado, h.fecha, h.id_estado_tramite, et.nombre_estado_tramite, h.rut_funcionario
     from historial_estado h
     join estado_tramite et on et.id_estado_tramite = h.id_estado_tramite
     where h.id_tramite = $1
     order by h.fecha, h.id_historial_estado`,
    [idTramite],
  );
  return rows;
}

// Guarda un trámite nuevo en su estado inicial y deja ese primer estado anotado en el historial.
// Las dos inserciones van en una transacción: o se guardan ambas o ninguna.
export async function insertarTramite({ rut_ciudadano, id_tipo_tramite }) {
  const cliente = await pool.connect();
  try {
    await cliente.query("begin");
    const { rows } = await cliente.query(
      `insert into tramite (rut_ciudadano, id_tipo_tramite, id_estado_tramite)
       values ($1, $2, $3)
       returning id_tramite`,
      [rut_ciudadano, id_tipo_tramite, idEstadoInicial],
    );
    const idTramite = rows[0].id_tramite;
    await cliente.query(
      `insert into historial_estado (id_tramite, id_estado_tramite) values ($1, $2)`,
      [idTramite, idEstadoInicial],
    );
    await cliente.query("commit");
    return buscarTramitePorId(idTramite);
  } catch (error) {
    await cliente.query("rollback");
    throw error;
  } finally {
    cliente.release();
  }
}

// Cambia los datos indicados de un trámite (sirve para PUT y PATCH); si no existe, no devuelve nada.
// Si el estado cambia, el nuevo estado queda anotado en el historial dentro de la misma transacción.
export async function actualizarTramite(idTramite, camposNuevos) {
  // Solo se aceptan campos conocidos, para que nadie pueda colar texto extraño en la consulta
  const nombresCampos = Object.keys(camposNuevos).filter((nombreCampo) =>
    columnasEditables.includes(nombreCampo),
  );
  const asignaciones = nombresCampos.map((nombreCampo, indice) => `${nombreCampo} = $${indice + 1}`);
  const valores = nombresCampos.map((nombreCampo) => camposNuevos[nombreCampo]);

  const cliente = await pool.connect();
  try {
    await cliente.query("begin");
    // Se lee el estado actual y se bloquea la fila hasta terminar, para comparar con el estado nuevo
    const { rows } = await cliente.query(
      `select id_estado_tramite from tramite where id_tramite = $1 for update`,
      [idTramite],
    );
    if (rows.length === 0) {
      await cliente.query("rollback");
      return undefined;
    }
    const idEstadoAnterior = rows[0].id_estado_tramite;

    await cliente.query(
      `update tramite
       set ${asignaciones.join(", ")}
       where id_tramite = $${nombresCampos.length + 1}`,
      [...valores, idTramite],
    );

    const idEstadoNuevo = camposNuevos.id_estado_tramite;
    if (idEstadoNuevo !== undefined && idEstadoNuevo !== idEstadoAnterior) {
      // rut_funcionario queda vacío por ahora; se llenará con el usuario del token cuando exista el login
      await cliente.query(
        `insert into historial_estado (id_tramite, id_estado_tramite) values ($1, $2)`,
        [idTramite, idEstadoNuevo],
      );
    }
    await cliente.query("commit");
    return buscarTramitePorId(idTramite);
  } catch (error) {
    await cliente.query("rollback");
    throw error;
  } finally {
    cliente.release();
  }
}

// Cuenta cuántas citas y documentos tiene un trámite, para saber si se puede borrar sin perder información
export async function contarCitasYDocumentosDelTramite(idTramite) {
  const { rows } = await pool.query(
    `select
       (select count(*) from cita where id_tramite = $1)::int as cantidad_citas,
       (select count(*) from documento where id_tramite = $1)::int as cantidad_documentos`,
    [idTramite],
  );
  return rows[0];
}

// Borra un trámite junto con su historial de estados y devuelve los datos que tenía; si no existía, no devuelve nada
export async function borrarTramite(idTramite) {
  const tramite = await buscarTramitePorId(idTramite);
  if (!tramite) return undefined;

  const cliente = await pool.connect();
  try {
    await cliente.query("begin");
    await cliente.query(`delete from historial_estado where id_tramite = $1`, [idTramite]);
    await cliente.query(`delete from tramite where id_tramite = $1`, [idTramite]);
    await cliente.query("commit");
    return tramite;
  } catch (error) {
    await cliente.query("rollback");
    throw error;
  } finally {
    cliente.release();
  }
}
