import * as usuarioService from "../services/usuarioService.js";
import {
  errorPostgresDuplicado,
  errorPostgresReferencia,
  responderError,
  esRutValido,
  esIdValido,
  esTextoValido,
  leerIdDeLaConsulta,
  buscarCamposDesconocidos,
} from "../utils/apoyoControladores.js";

// Este archivo recibe las peticiones de usuarios: revisa que los datos sean correctos,
// le pide al servicio que haga el trabajo en la base de datos y decide qué responderle al cliente.
// La creación de usuarios no está aquí porque corresponde al registro, que se hace junto con el login.

// Campos obligatorios al reemplazar un usuario con PUT (el teléfono es opcional y queda vacío si no se envía)
const camposObligatoriosPut = ["nombre", "correo", "activo", "id_rol"];

// ---------------------------------------------------------------------
// Funciones de apoyo
// ---------------------------------------------------------------------

// Revisa que el texto tenga forma de correo electrónico (algo@algo.dominio) y no pase de 100 caracteres
function esCorreoValido(texto) {
  return typeof texto === "string" && texto.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
}

// Revisa que el teléfono tenga solo números, con un + opcional al inicio (por ejemplo +56912345678)
function esTelefonoValido(texto) {
  return typeof texto === "string" && /^\+?[0-9]{8,14}$/.test(texto);
}

// Toma el RUT que viene en la URL; si no tiene el formato correcto, devuelve null
function leerRutDeLaUrl(req) {
  return esRutValido(req.params.rut) ? req.params.rut : null;
}

// Revisa los datos enviados para editar un usuario y devuelve la lista de problemas encontrados (vacía si todo está bien).
// Al editar solo algunos campos (PATCH) no se exige que vengan todos.
function validarDatosUsuario(datosUsuario, { esParcial }) {
  const errores = [];

  const camposDesconocidos = buscarCamposDesconocidos(datosUsuario, usuarioService.columnasEditables);
  if (camposDesconocidos.length > 0) errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);

  if (!esParcial) {
    for (const nombreCampo of camposObligatoriosPut) {
      if (datosUsuario[nombreCampo] === undefined) errores.push(`Falta el campo ${nombreCampo}`);
    }
  }

  const { nombre, correo, telefono, activo, id_rol } = datosUsuario;
  if (nombre !== undefined && !esTextoValido(nombre, 60)) {
    errores.push("nombre debe ser un texto de hasta 60 caracteres");
  }
  if (correo !== undefined && !esCorreoValido(correo)) {
    errores.push("correo debe ser un correo electrónico válido de hasta 100 caracteres");
  }
  if (telefono !== undefined && telefono !== null && !esTelefonoValido(telefono)) {
    errores.push("telefono debe tener entre 8 y 14 dígitos, con un + opcional al inicio");
  }
  if (activo !== undefined && typeof activo !== "boolean") {
    errores.push("activo debe ser true o false");
  }
  if (id_rol !== undefined && !esIdValido(id_rol)) {
    errores.push("id_rol debe ser un número entero mayor que 0");
  }

  return errores;
}

// Si la base de datos rechazó la operación por un motivo conocido, responde al cliente con un mensaje claro.
// Devuelve false cuando es un error inesperado, para que lo maneje el servidor.
function responderErrorDeBaseDeDatos(res, error) {
  if (error.code === errorPostgresDuplicado) {
    responderError(res, 409, "Ya existe otro usuario con ese correo");
    return true;
  }
  if (error.code === errorPostgresReferencia && error.constraint === "usuario_id_rol_fkey") {
    responderError(res, 400, "No existe un rol con ese id_rol");
    return true;
  }
  return false;
}

// Atiende PUT y PATCH, que solo se diferencian en si se exigen todos los campos o no
async function editarUsuario(req, res, { esParcial }) {
  const rut = leerRutDeLaUrl(req);
  if (!rut) return responderError(res, 400, "El RUT debe tener formato 12345678-9, sin puntos y con guion");

  const camposNuevos = req.body ?? {};
  if (esParcial && Object.keys(camposNuevos).length === 0) {
    return responderError(res, 400, "Envía al menos un campo para actualizar");
  }
  const errores = validarDatosUsuario(camposNuevos, { esParcial });
  if (errores.length > 0) return responderError(res, 400, "Datos del usuario inválidos", errores);

  // En PUT el teléfono que no se envía queda vacío, porque se reemplaza el usuario completo
  const datosParaGuardar = esParcial ? camposNuevos : { telefono: null, ...camposNuevos };

  try {
    const usuarioActualizado = await usuarioService.actualizarUsuario(rut, datosParaGuardar);
    if (!usuarioActualizado) return responderError(res, 404, "Usuario no encontrado");
    res.status(200).json({ datos: usuarioActualizado });
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// ---------------------------------------------------------------------
// Funciones que atienden cada ruta
// ---------------------------------------------------------------------

// GET /api/usuarios
// Devuelve la lista de usuarios, sin sus contraseñas. Se puede filtrar por rol y por si están activos
// (ejemplo: ?id_rol=2&activo=true). Responde 400 si los filtros no son válidos.
export async function listarUsuarios(req, res) {
  const { activo } = req.query;
  const idRol = leerIdDeLaConsulta(req.query.id_rol);

  if (Number.isNaN(idRol)) return responderError(res, 400, "El filtro id_rol debe ser un número entero positivo");
  if (activo && activo !== "true" && activo !== "false") {
    return responderError(res, 400, "El filtro activo debe ser true o false");
  }

  const usuarios = await usuarioService.buscarUsuarios({
    id_rol: idRol,
    activo: activo ? activo === "true" : null,
  });
  res.status(200).json({ datos: usuarios });
}

// GET /api/usuarios/:rut
// Devuelve un usuario según su RUT. Responde 404 si no existe.
export async function obtenerUsuario(req, res) {
  const rut = leerRutDeLaUrl(req);
  if (!rut) return responderError(res, 400, "El RUT debe tener formato 12345678-9, sin puntos y con guion");

  const usuario = await usuarioService.buscarUsuarioPorRut(rut);
  if (!usuario) return responderError(res, 404, "Usuario no encontrado");

  res.status(200).json({ datos: usuario });
}

// PUT /api/usuarios/:rut
// Reemplaza el nombre, el correo, el teléfono, el rol y si está activo. No cambia el RUT ni la contraseña.
// Responde con el usuario actualizado, 404 si no existe, o 409 si el correo ya lo usa otro usuario.
export async function reemplazarUsuario(req, res) {
  return editarUsuario(req, res, { esParcial: false });
}

// PATCH /api/usuarios/:rut
// Cambia solo los datos enviados, por ejemplo para desactivar un usuario con { "activo": false }.
// Responde con el usuario actualizado, 404 si no existe, o 409 si el correo ya lo usa otro usuario.
export async function actualizarUsuario(req, res) {
  return editarUsuario(req, res, { esParcial: true });
}

// DELETE /api/usuarios/:rut
// Elimina un usuario que no tenga trámites ni revisiones registradas. Responde 200 con un mensaje y el usuario borrado,
// 404 si no existe, o 409 si tiene información asociada (en ese caso conviene desactivarlo).
export async function eliminarUsuario(req, res) {
  const rut = leerRutDeLaUrl(req);
  if (!rut) return responderError(res, 400, "El RUT debe tener formato 12345678-9, sin puntos y con guion");

  try {
    const usuarioEliminado = await usuarioService.borrarUsuario(rut);
    if (!usuarioEliminado) return responderError(res, 404, "Usuario no encontrado");
    res.status(200).json({ mensaje: "Usuario eliminado", datos: usuarioEliminado });
  } catch (error) {
    // La base de datos no deja borrar un usuario al que apuntan trámites, documentos revisados o cambios de estado
    if (error.code !== errorPostgresReferencia) throw error;
    responderError(
      res,
      409,
      "El usuario tiene trámites o revisiones asociadas y no se puede eliminar; desactívalo con PATCH { \"activo\": false }",
    );
  }
}
