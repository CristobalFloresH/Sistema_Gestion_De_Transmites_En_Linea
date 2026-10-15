import { pool } from "../config/db.js";

// Este archivo es el único que habla con la base de datos para los usuarios:
// aquí están las consultas SQL de buscar, editar y borrar usuarios.
// Nunca se devuelve clave_hash, para no exponer las contraseñas aunque estén cifradas.

// Datos que se devuelven de cada usuario, con el nombre de su rol
const columnasUsuario = `
  u.rut,
  u.nombre,
  u.correo,
  u.telefono,
  u.activo,
  u.id_rol,
  r.nombre_rol`;

// Datos de un usuario que se pueden modificar desde la API (el RUT no cambia porque es la llave del usuario)
export const columnasEditables = ["nombre", "correo", "telefono", "activo", "id_rol"];

// Busca los usuarios, opcionalmente filtrados por rol o por si están activos, ordenados por nombre
export async function buscarUsuarios({ id_rol, activo }) {
  const { rows } = await pool.query(
    `select ${columnasUsuario}
     from usuario u
     join rol r on r.id_rol = u.id_rol
     where ($1::int is null or u.id_rol = $1)
       and ($2::boolean is null or u.activo = $2)
     order by u.nombre, u.rut`,
    [id_rol ?? null, activo ?? null],
  );
  return rows;
}

// Busca un usuario por su RUT; si no existe, no devuelve nada
export async function buscarUsuarioPorRut(rut) {
  const { rows } = await pool.query(
    `select ${columnasUsuario}
     from usuario u
     join rol r on r.id_rol = u.id_rol
     where u.rut = $1`,
    [rut],
  );
  return rows[0];
}

// Cambia los datos indicados de un usuario (sirve para PUT y PATCH); si el usuario no existe, no devuelve nada
export async function actualizarUsuario(rut, camposNuevos) {
  // Solo se aceptan campos conocidos, para que nadie pueda colar texto extraño en la consulta
  const nombresCampos = Object.keys(camposNuevos).filter((nombreCampo) =>
    columnasEditables.includes(nombreCampo),
  );
  const asignaciones = nombresCampos.map((nombreCampo, indice) => `${nombreCampo} = $${indice + 1}`);
  const valores = nombresCampos.map((nombreCampo) => camposNuevos[nombreCampo]);

  const { rowCount } = await pool.query(
    `update usuario
     set ${asignaciones.join(", ")}
     where rut = $${nombresCampos.length + 1}`,
    [...valores, rut],
  );
  return rowCount === 0 ? undefined : buscarUsuarioPorRut(rut);
}

// Borra un usuario y devuelve los datos que tenía; si no existía, no devuelve nada
export async function borrarUsuario(rut) {
  const usuario = await buscarUsuarioPorRut(rut);
  if (!usuario) return undefined;
  await pool.query(`delete from usuario where rut = $1`, [rut]);
  return usuario;
}
