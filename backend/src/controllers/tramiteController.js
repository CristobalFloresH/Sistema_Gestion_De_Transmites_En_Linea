import * as tramiteService from "../services/tramiteService.js";
import {
  errorPostgresReferencia,
  responderError,
  esRutValido,
  esIdValido,
  leerIdDeLaUrl,
  leerIdDeLaConsulta,
  buscarCamposDesconocidos,
} from "../utils/apoyoControladores.js";

// Este archivo recibe las peticiones de trámites: revisa que los datos sean correctos,
// le pide al servicio que haga el trabajo en la base de datos y decide qué responderle al cliente.

// Mensaje para cada dato que apunta a otra tabla, por si la base de datos avisa que ese registro no existe
const mensajesReferenciaInexistente = {
  tramite_rut_ciudadano_fkey: "No existe un usuario con ese rut_ciudadano",
  tramite_id_tipo_tramite_fkey: "No existe un tipo de trámite con ese id_tipo_tramite",
  tramite_id_estado_tramite_fkey: "No existe un estado de trámite con ese id_estado_tramite",
};

// ---------------------------------------------------------------------
// Funciones de apoyo
// ---------------------------------------------------------------------

// Revisa los datos para crear un trámite (POST) y devuelve la lista de problemas encontrados (vacía si todo está bien)
function validarDatosCreacion(datosTramite) {
  const errores = [];

  const camposDesconocidos = buscarCamposDesconocidos(datosTramite, tramiteService.columnasCreacion);
  if (camposDesconocidos.length > 0) errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);

  const { rut_ciudadano, id_tipo_tramite } = datosTramite;
  if (rut_ciudadano === undefined) errores.push("Falta el campo rut_ciudadano");
  else if (!esRutValido(rut_ciudadano)) errores.push("rut_ciudadano debe tener formato 12345678-9, sin puntos y con guion");

  if (id_tipo_tramite === undefined) errores.push("Falta el campo id_tipo_tramite");
  else if (!esIdValido(id_tipo_tramite)) errores.push("id_tipo_tramite debe ser un número entero mayor que 0");

  return errores;
}

// Revisa los datos para editar un trámite y devuelve la lista de problemas encontrados.
// Al editar solo algunos campos (PATCH) no se exige que vengan todos.
function validarDatosEdicion(datosTramite, { esParcial }) {
  const errores = [];

  const camposDesconocidos = buscarCamposDesconocidos(datosTramite, tramiteService.columnasEditables);
  if (camposDesconocidos.length > 0) errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);

  for (const nombreCampo of tramiteService.columnasEditables) {
    const valor = datosTramite[nombreCampo];
    if (valor === undefined) {
      if (!esParcial) errores.push(`Falta el campo ${nombreCampo}`);
    } else if (!esIdValido(valor)) {
      errores.push(`${nombreCampo} debe ser un número entero mayor que 0`);
    }
  }

  return errores;
}

// Si la base de datos rechazó la operación porque un dato apunta a un registro que no existe, responde 400 con un mensaje claro.
// Devuelve false cuando es un error inesperado, para que lo maneje el servidor.
function responderErrorDeBaseDeDatos(res, error) {
  if (error.code === errorPostgresReferencia && mensajesReferenciaInexistente[error.constraint]) {
    responderError(res, 400, mensajesReferenciaInexistente[error.constraint]);
    return true;
  }
  return false;
}

// Atiende PUT y PATCH, que solo se diferencian en si se exigen todos los campos o no
async function editarTramite(req, res, { esParcial }) {
  const idTramite = leerIdDeLaUrl(req);
  if (!idTramite) return responderError(res, 400, "El id debe ser un número entero positivo");

  const camposNuevos = req.body ?? {};
  if (esParcial && Object.keys(camposNuevos).length === 0) {
    return responderError(res, 400, "Envía al menos un campo para actualizar");
  }
  const errores = validarDatosEdicion(camposNuevos, { esParcial });
  if (errores.length > 0) return responderError(res, 400, "Datos del trámite inválidos", errores);

  try {
    const tramiteActualizado = await tramiteService.actualizarTramite(idTramite, camposNuevos);
    if (!tramiteActualizado) return responderError(res, 404, "Trámite no encontrado");
    res.status(200).json({ datos: tramiteActualizado });
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// ---------------------------------------------------------------------
// Funciones que atienden cada ruta
// ---------------------------------------------------------------------

// GET /api/tramites
// Devuelve la lista de trámites. Se puede filtrar por ciudadano, tipo y estado
// (ejemplo: ?rut_ciudadano=20123456-5&id_estado_tramite=1). Responde 400 si los filtros no son válidos.
export async function listarTramites(req, res) {
  const { rut_ciudadano } = req.query;
  const idTipoTramite = leerIdDeLaConsulta(req.query.id_tipo_tramite);
  const idEstadoTramite = leerIdDeLaConsulta(req.query.id_estado_tramite);

  if (rut_ciudadano && !esRutValido(rut_ciudadano)) {
    return responderError(res, 400, "El filtro rut_ciudadano debe tener formato 12345678-9");
  }
  if (Number.isNaN(idTipoTramite) || Number.isNaN(idEstadoTramite)) {
    return responderError(res, 400, "Los filtros id_tipo_tramite e id_estado_tramite deben ser números enteros positivos");
  }

  const tramites = await tramiteService.buscarTramites({
    rut_ciudadano: rut_ciudadano || null,
    id_tipo_tramite: idTipoTramite,
    id_estado_tramite: idEstadoTramite,
  });
  res.status(200).json({ datos: tramites });
}

// GET /api/tramites/:id
// Devuelve un trámite según su id, junto con su historial de estados. Responde 404 si no existe.
export async function obtenerTramite(req, res) {
  const idTramite = leerIdDeLaUrl(req);
  if (!idTramite) return responderError(res, 400, "El id debe ser un número entero positivo");

  const tramite = await tramiteService.buscarTramitePorId(idTramite);
  if (!tramite) return responderError(res, 404, "Trámite no encontrado");

  const historial = await tramiteService.buscarHistorialDelTramite(idTramite);
  res.status(200).json({ datos: { ...tramite, historial } });
}

// POST /api/tramites
// Crea un trámite nuevo para un ciudadano; parte en el estado inicial y queda anotado en el historial.
// Responde 201 con el trámite creado, o 400 si los datos no son válidos o apuntan a registros que no existen.
export async function crearTramite(req, res) {
  const datosTramite = req.body ?? {};
  const errores = validarDatosCreacion(datosTramite);
  if (errores.length > 0) return responderError(res, 400, "Datos del trámite inválidos", errores);

  try {
    const tramiteCreado = await tramiteService.insertarTramite(datosTramite);
    res.status(201).location(`/api/tramites/${tramiteCreado.id_tramite}`).json({ datos: tramiteCreado });
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// PUT /api/tramites/:id
// Reemplaza el tipo y el estado de un trámite (los dos son obligatorios). Si el estado cambia, se anota en el historial.
// Responde con el trámite actualizado o 404 si no existe.
export async function reemplazarTramite(req, res) {
  return editarTramite(req, res, { esParcial: false });
}

// PATCH /api/tramites/:id
// Cambia solo los datos enviados de un trámite, por ejemplo para avanzar su estado con { "id_estado_tramite": 2 }.
// Responde con el trámite actualizado o 404 si no existe.
export async function actualizarTramite(req, res) {
  return editarTramite(req, res, { esParcial: true });
}

// DELETE /api/tramites/:id
// Elimina un trámite que no tenga citas ni documentos (junto con su historial). Responde 200 con un mensaje
// y el trámite borrado, 404 si no existe, o 409 si tiene citas o documentos asociados.
export async function eliminarTramite(req, res) {
  const idTramite = leerIdDeLaUrl(req);
  if (!idTramite) return responderError(res, 400, "El id debe ser un número entero positivo");

  // Si el trámite ya tiene citas o documentos no se borra, para no perder esa información
  const { cantidad_citas, cantidad_documentos } = await tramiteService.contarCitasYDocumentosDelTramite(idTramite);
  if (cantidad_citas > 0 || cantidad_documentos > 0) {
    return responderError(
      res,
      409,
      "El trámite tiene citas o documentos asociados y no se puede eliminar; puedes marcarlo como rechazado con PATCH { \"id_estado_tramite\": 7 }",
    );
  }

  const tramiteEliminado = await tramiteService.borrarTramite(idTramite);
  if (!tramiteEliminado) return responderError(res, 404, "Trámite no encontrado");

  res.status(200).json({ mensaje: "Trámite eliminado", datos: tramiteEliminado });
}
