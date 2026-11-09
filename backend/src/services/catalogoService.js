import { pool } from "../config/db.js";

// Este archivo es el único que habla con la base de datos para los catálogos: las listas fijas
// que usa el sistema (tipos de trámite, estados, métodos de notificación, etc.). Solo se leen.

// Devuelve los tipos de trámite, cada uno con la lista de documentos que se le piden al ciudadano
export async function buscarTiposTramite() {
  const { rows } = await pool.query(
    `select
       tt.id_tipo_tramite,
       tt.nombre_tipo_tramite,
       tt.duracion_min,
       coalesce(
         json_agg(
           json_build_object('id_tipo_documento', td.id_tipo_documento, 'nombre_tipo_documento', td.nombre_tipo_documento)
           order by td.id_tipo_documento
         ) filter (where td.id_tipo_documento is not null),
         '[]'
       ) as documentos_requeridos
     from tipo_tramite tt
     left join requiere r on r.id_tipo_tramite = tt.id_tipo_tramite
     left join tipo_documento td on td.id_tipo_documento = r.id_tipo_documento
     group by tt.id_tipo_tramite
     order by tt.id_tipo_tramite`,
  );
  return rows;
}

// Devuelve los tipos de documento que existen
export async function buscarTiposDocumento() {
  const { rows } = await pool.query(
    `select id_tipo_documento, nombre_tipo_documento from tipo_documento order by id_tipo_documento`,
  );
  return rows;
}

// Devuelve los estados por los que pasa un trámite, en orden
export async function buscarEstadosTramite() {
  const { rows } = await pool.query(
    `select id_estado_tramite, nombre_estado_tramite from estado_tramite order by id_estado_tramite`,
  );
  return rows;
}

// Devuelve los estados que puede tener un documento (pendiente, aprobado, rechazado)
export async function buscarEstadosDocumento() {
  const { rows } = await pool.query(
    `select id_estado_documento, nombre_estado_documento from estado_documento order by id_estado_documento`,
  );
  return rows;
}

// Devuelve las formas en que se le puede avisar al ciudadano de su cita
export async function buscarMetodosNotificacion() {
  const { rows } = await pool.query(
    `select id_metodo_notificacion, nombre_metodo_notificacion from metodo_notificacion order by id_metodo_notificacion`,
  );
  return rows;
}

// Devuelve los roles de usuario (ciudadano, funcionario, administrador)
export async function buscarRoles() {
  const { rows } = await pool.query(`select id_rol, nombre_rol from rol order by id_rol`);
  return rows;
}
