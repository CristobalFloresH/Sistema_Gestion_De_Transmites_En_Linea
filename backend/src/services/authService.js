import { pool } from "../config/db.js";

//Se busca a un usuario usando su RUT
export async function buscarUsuarioPorRut(rut) {
  const { rows } = await pool.query(
    `select u.rut, u.nombre, u.correo, u.clave_hash, u.activo, r.nombre_rol as rol
     from usuario u
     join rol r on r.id_rol = u.id_rol
     where u.rut = $1`,
    [rut],
  );
  //Se devuelve al usuario 
  return rows[0];
}

//Crea un usuario nuevo en la BD con el rol indicado por el administrador
export async function crearUsuario({ rut, nombre, correo, telefono, claveHash, rol }) {
  const { rows } = await pool.query(
    `insert into usuario (rut, nombre, correo, telefono, clave_hash, id_rol)
     values ($1, $2, $3, $4, $5, (select id_rol from rol where nombre_rol = $6))
     returning rut, nombre, correo, telefono`,
    [rut, nombre, correo, telefono ?? null, claveHash, rol], //Si no hay telefono se guarda como NULL en BD
  );
  return rows[0];
}