import { pool } from "../config/db.js";

// Este archivo es el único que habla con la base de datos para los documentos de los trámites:
// aquí están todas las consultas SQL de buscar, registrar, revisar y borrar documentos.

// Datos que se devuelven de cada documento, con los nombres de su tipo y de su estado
const columnasDocumento = `
  d.id_documento,
  d.nombre_archivo,
  d.ruta,
  d.hash,
  d.fecha_subida,
  d.id_tramite,
  d.id_tipo_documento,
  td.nombre_tipo_documento,
  d.id_estado_documento,
  ed.nombre_estado_documento,
  d.motivo_rechazo,
  d.fecha_revision,
  d.rut_revisor`;

// Tablas que se unen para obtener esos nombres
const tablasDocumento = `
  documento d
  join tipo_documento td on td.id_tipo_documento = d.id_tipo_documento
  join estado_documento ed on ed.id_estado_documento = d.id_estado_documento`;

// Datos de un documento que se pueden enviar al registrarlo y al editarlo desde la API
export const columnasCreacion = ["id_tramite", "id_tipo_documento", "nombre_archivo"];
export const columnasEditables = ["nombre_archivo", "id_estado_documento", "motivo_rechazo", "rut_revisor"];

// Busca los documentos, opcionalmente filtrados por trámite o por estado, ordenados por trámite y fecha de subida
export async function buscarDocumentos({ id_tramite, id_estado_documento }) {
  const { rows } = await pool.query(
    `select ${columnasDocumento}
     from ${tablasDocumento}
     where ($1::int is null or d.id_tramite = $1)
       and ($2::int is null or d.id_estado_documento = $2)
     order by d.id_tramite, d.fecha_subida, d.id_documento`,
    [id_tramite ?? null, id_estado_documento ?? null],
  );
  return rows;
}

// Busca un documento por su id; si no existe, no devuelve nada
export async function buscarDocumentoPorId(idDocumento) {
  const { rows } = await pool.query(
    `select ${columnasDocumento}
     from ${tablasDocumento}
     where d.id_documento = $1`,
    [idDocumento],
  );
  return rows[0];
}

// Busca el tipo de trámite de un trámite y revisa si ese tipo de trámite pide el tipo de documento indicado.
// Devuelve null si el trámite no existe, o { exigeDocumento } con true o false.
export async function revisarSiTramiteExigeDocumento(idTramite, idTipoDocumento) {
  const { rows } = await pool.query(
    `select exists (
       select 1 from requiere r
       where r.id_tipo_tramite = t.id_tipo_tramite and r.id_tipo_documento = $2
     ) as exige_documento
     from tramite t
     where t.id_tramite = $1`,
    [idTramite, idTipoDocumento],
  );
  return rows[0] ? { exigeDocumento: rows[0].exige_documento } : null;
}

// Registra un documento nuevo de un trámite; siempre parte en estado pendiente (1) hasta que un funcionario lo revise
export async function insertarDocumento({ id_tramite, id_tipo_documento, nombre_archivo }) {
  const { rows } = await pool.query(
    `insert into documento (id_tramite, id_tipo_documento, nombre_archivo, id_estado_documento)
     values ($1, $2, $3, 1)
     returning id_documento`,
    [id_tramite, id_tipo_documento, nombre_archivo],
  );
  return buscarDocumentoPorId(rows[0].id_documento);
}

// Guarda los datos finales de un documento (sirve para PUT y PATCH); si no existe, no devuelve nada.
// La fecha de revisión se pone sola: se borra si vuelve a pendiente y se actualiza cuando cambia el estado.
export async function actualizarDocumento(idDocumento, { nombre_archivo, id_estado_documento, motivo_rechazo, rut_revisor }) {
  const { rowCount } = await pool.query(
    `update documento
     set nombre_archivo = $1,
         motivo_rechazo = $3,
         rut_revisor = $4,
         fecha_revision = case
           when $2 = 1 then null
           when id_estado_documento <> $2 then now()
           else fecha_revision
         end,
         id_estado_documento = $2
     where id_documento = $5`,
    [nombre_archivo, id_estado_documento, motivo_rechazo, rut_revisor, idDocumento],
  );
  return rowCount === 0 ? undefined : buscarDocumentoPorId(idDocumento);
}

// Borra un documento y devuelve los datos que tenía; si no existía, no devuelve nada
export async function borrarDocumento(idDocumento) {
  const documento = await buscarDocumentoPorId(idDocumento);
  if (!documento) return undefined;
  await pool.query(`delete from documento where id_documento = $1`, [idDocumento]);
  return documento;
}
