import * as documentoService from "../services/documentoService.js";
import { esPdf, calcularHash, guardarPdf, borrarPdf } from "../utils/archivos.js";
import {
  errorPostgresReferencia,
  responderError,
  esRutValido,
  esIdValido,
  esTextoValido,
  leerIdDeLaUrl,
  leerIdDeLaConsulta,
  buscarCamposDesconocidos,
} from "../utils/apoyoControladores.js";

// Este archivo recibe las peticiones de documentos: revisa que los datos sean correctos,
// le pide al servicio que haga el trabajo en la base de datos y decide qué responderle al cliente.

// Estados del catálogo estado_documento, en el orden en que se cargan en licencias.sql
const idEstadoPendiente = 1;
const idEstadoRechazado = 3;

// Mensaje para cada dato que apunta a otra tabla, por si la base de datos avisa que ese registro no existe
const mensajesReferenciaInexistente = {
  documento_id_tramite_fkey: "No existe un trámite con ese id_tramite",
  documento_id_tipo_documento_fkey: "No existe un tipo de documento con ese id_tipo_documento",
  documento_id_estado_documento_fkey: "No existe un estado de documento con ese id_estado_documento",
  documento_rut_revisor_fkey: "No existe un usuario con ese rut_revisor",
};

// ---------------------------------------------------------------------
// Funciones de apoyo
// ---------------------------------------------------------------------

// Revisa que el nombre del archivo tenga texto sin elementos HTML y termine en .pdf, porque el sistema solo recibe documentos PDF
function esNombreArchivoValido(nombreArchivo) {
  return (
    esTextoValido(nombreArchivo, 255) &&
    /\.pdf$/i.test(nombreArchivo) &&
    !/[<>\/\\\u0000-\u001f]/.test(nombreArchivo)
  );
}

// Revisa los datos para registrar un documento (POST) y devuelve la lista de problemas encontrados (vacía si todo está bien).
// El archivo viaja aparte, en multipart; aquí solo se revisan los campos de texto que lo acompañan.
function validarDatosCreacion(datosDocumento) {
  const errores = [];

  const camposDesconocidos = buscarCamposDesconocidos(datosDocumento, documentoService.columnasCreacion);
  if (camposDesconocidos.length > 0) errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);

  const { id_tramite, id_tipo_documento } = datosDocumento;
  if (id_tramite === undefined) errores.push("Falta el campo id_tramite");
  else if (!esIdValido(id_tramite)) errores.push("id_tramite debe ser un número entero mayor que 0");

  if (id_tipo_documento === undefined) errores.push("Falta el campo id_tipo_documento");
  else if (!esIdValido(id_tipo_documento)) errores.push("id_tipo_documento debe ser un número entero mayor que 0");

  return errores;
}

// El nombre original lo manda el navegador en latin1; así se recupera tal como lo escribió la persona (tildes, ñ)
function leerNombreDelArchivo(archivo) {
  return Buffer.from(archivo.originalname, "latin1").toString("utf8");
}

// Revisa los campos enviados para editar un documento y devuelve la lista de problemas encontrados.
// En PUT son obligatorios el nombre del archivo y el estado; motivo_rechazo y rut_revisor pueden faltar o ser null.
function validarDatosEdicion(datosDocumento, { esParcial }) {
  const errores = [];

  const camposDesconocidos = buscarCamposDesconocidos(datosDocumento, documentoService.columnasEditables);
  if (camposDesconocidos.length > 0) errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);

  const { nombre_archivo, id_estado_documento, motivo_rechazo, rut_revisor } = datosDocumento;
  if (!esParcial) {
    if (nombre_archivo === undefined) errores.push("Falta el campo nombre_archivo");
    if (id_estado_documento === undefined) errores.push("Falta el campo id_estado_documento");
  }
  if (nombre_archivo !== undefined && !esNombreArchivoValido(nombre_archivo)) {
    errores.push("nombre_archivo debe ser un nombre de archivo .pdf de hasta 255 caracteres");
  }
  if (id_estado_documento !== undefined && !esIdValido(id_estado_documento)) {
    errores.push("id_estado_documento debe ser un número entero mayor que 0");
  }
  if (motivo_rechazo !== undefined && motivo_rechazo !== null && !esTextoValido(motivo_rechazo, 255)) {
    errores.push("motivo_rechazo debe ser un texto de hasta 255 caracteres");
  }
  if (rut_revisor !== undefined && rut_revisor !== null && !esRutValido(rut_revisor)) {
    errores.push("rut_revisor debe tener formato 12345678-9, sin puntos y con guion");
  }

  return errores;
}

// Junta los datos actuales del documento con los enviados y aplica las reglas de la revisión:
// un documento rechazado necesita motivo, el motivo solo se guarda si está rechazado, y uno pendiente no tiene revisor.
function armarDatosFinales(documentoActual, camposNuevos, { esParcial }) {
  const datosFinales = esParcial
    ? {
        nombre_archivo: documentoActual.nombre_archivo,
        id_estado_documento: documentoActual.id_estado_documento,
        motivo_rechazo: documentoActual.motivo_rechazo,
        rut_revisor: documentoActual.rut_revisor,
        ...camposNuevos,
      }
    : { motivo_rechazo: null, rut_revisor: null, ...camposNuevos };

  if (datosFinales.id_estado_documento !== idEstadoRechazado) datosFinales.motivo_rechazo = null;
  if (datosFinales.id_estado_documento === idEstadoPendiente) datosFinales.rut_revisor = null;
  return datosFinales;
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
async function editarDocumento(req, res, { esParcial }) {
  const idDocumento = leerIdDeLaUrl(req);
  if (!idDocumento) return responderError(res, 400, "El id debe ser un número entero positivo");

  const camposNuevos = req.body ?? {};
  if (esParcial && Object.keys(camposNuevos).length === 0) {
    return responderError(res, 400, "Envía al menos un campo para actualizar");
  }
  const errores = validarDatosEdicion(camposNuevos, { esParcial });
  if (errores.length > 0) return responderError(res, 400, "Datos del documento inválidos", errores);

  const documentoActual = await documentoService.buscarDocumentoPorId(idDocumento);
  if (!documentoActual) return responderError(res, 404, "Documento no encontrado");

  const datosFinales = armarDatosFinales(documentoActual, camposNuevos, { esParcial });
  if (datosFinales.id_estado_documento === idEstadoRechazado && !datosFinales.motivo_rechazo) {
    return responderError(res, 400, "Para rechazar un documento debes indicar motivo_rechazo");
  }

  try {
    const documentoActualizado = await documentoService.actualizarDocumento(idDocumento, datosFinales);
    if (!documentoActualizado) return responderError(res, 404, "Documento no encontrado");
    res.status(200).json({ datos: documentoActualizado });
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// ---------------------------------------------------------------------
// Funciones que atienden cada ruta
// ---------------------------------------------------------------------

// GET /api/documentos
// Devuelve la lista de documentos. Se puede filtrar por trámite y por estado (ejemplo: ?id_tramite=1&id_estado_documento=1).
// Responde 400 si los filtros no son válidos.
export async function listarDocumentos(req, res) {
  const idTramite = leerIdDeLaConsulta(req.query.id_tramite);
  const idEstadoDocumento = leerIdDeLaConsulta(req.query.id_estado_documento);
  if (Number.isNaN(idTramite) || Number.isNaN(idEstadoDocumento)) {
    return responderError(res, 400, "Los filtros id_tramite e id_estado_documento deben ser números enteros positivos");
  }

  const documentos = await documentoService.buscarDocumentos({
    id_tramite: idTramite,
    id_estado_documento: idEstadoDocumento,
  });
  res.status(200).json({ datos: documentos });
}

// GET /api/documentos/:id
// Devuelve un documento según su id. Responde 404 si no existe.
export async function obtenerDocumento(req, res) {
  const idDocumento = leerIdDeLaUrl(req);
  if (!idDocumento) return responderError(res, 400, "El id debe ser un número entero positivo");

  const documento = await documentoService.buscarDocumentoPorId(idDocumento);
  if (!documento) return responderError(res, 404, "Documento no encontrado");

  res.status(200).json({ datos: documento });
}

// POST /api/documentos
// Sube el PDF de un trámite (multipart/form-data con id_tramite, id_tipo_documento y el archivo en "archivo");
// queda pendiente de revisión. Responde 201 con el documento creado, o 400 si los datos no son válidos,
// el archivo no es un PDF, el trámite no existe o ese tipo de documento no se pide para ese trámite.
// El archivo se escribe en disco solo después de que pasó todas las comprobaciones.
export async function crearDocumento(req, res) {
  const datosDocumento = req.body ?? {};
  const errores = validarDatosCreacion(datosDocumento);
  if (errores.length > 0) return responderError(res, 400, "Datos del documento inválidos", errores);

  const archivo = req.file;
  if (!archivo) return responderError(res, 400, "Debes adjuntar el archivo PDF en el campo archivo");

  const nombreArchivo = leerNombreDelArchivo(archivo);
  if (!esNombreArchivoValido(nombreArchivo)) {
    return responderError(res, 400, "El archivo debe llamarse .pdf, sin los símbolos < > / \\ y con un nombre de hasta 255 caracteres");
  }
  // No basta con la extensión ni con el tipo que declara el navegador: se revisa el contenido real
  if (!esPdf(archivo.buffer)) {
    return responderError(res, 400, "El archivo no es un PDF válido");
  }

  const revision = await documentoService.revisarSiTramiteExigeDocumento(datosDocumento.id_tramite, datosDocumento.id_tipo_documento);
  if (!revision) return responderError(res, 400, "No existe un trámite con ese id_tramite");
  if (!revision.exigeDocumento) {
    return responderError(res, 400, "Ese tipo de documento no existe o no se pide para este tipo de trámite");
  }

  const ruta = await guardarPdf(archivo.buffer);
  try {
    const documentoCreado = await documentoService.insertarDocumento({
      ...datosDocumento,
      nombre_archivo: nombreArchivo,
      ruta,
      hash: calcularHash(archivo.buffer),
    });
    res.status(201).location(`/api/documentos/${documentoCreado.id_documento}`).json({ datos: documentoCreado });
  } catch (error) {
    // Si no se pudo guardar en la base, el archivo que acaba de escribirse no debe quedar suelto en el disco
    await borrarPdf(ruta);
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// PUT /api/documentos/:id
// Reemplaza el nombre del archivo, el estado, el motivo de rechazo y el revisor de un documento.
// Responde con el documento actualizado, 404 si no existe, o 400 si se rechaza sin motivo.
export async function reemplazarDocumento(req, res) {
  return editarDocumento(req, res, { esParcial: false });
}

// PATCH /api/documentos/:id
// Cambia solo los datos enviados; sirve para que un funcionario apruebe ({ "id_estado_documento": 2 })
// o rechace ({ "id_estado_documento": 3, "motivo_rechazo": "..." }) un documento.
// Responde con el documento actualizado, 404 si no existe, o 400 si se rechaza sin motivo.
export async function actualizarDocumento(req, res) {
  return editarDocumento(req, res, { esParcial: true });
}

// DELETE /api/documentos/:id
// Elimina un documento que todavía está pendiente de revisión. Responde 200 con un mensaje y el documento borrado,
// 404 si no existe, o 409 si ya fue revisado (para no perder la revisión).
export async function eliminarDocumento(req, res) {
  const idDocumento = leerIdDeLaUrl(req);
  if (!idDocumento) return responderError(res, 400, "El id debe ser un número entero positivo");

  const documento = await documentoService.buscarDocumentoPorId(idDocumento);
  if (!documento) return responderError(res, 404, "Documento no encontrado");
  if (documento.id_estado_documento !== idEstadoPendiente) {
    return responderError(res, 409, "El documento ya fue revisado y no se puede eliminar");
  }

  const documentoEliminado = await documentoService.borrarDocumento(idDocumento);
  if (!documentoEliminado) return responderError(res, 404, "Documento no encontrado");

  // El PDF se borra después de la base: si la base falla, el archivo sigue ahí y el documento no se pierde
  await borrarPdf(documentoEliminado.ruta);
  res.status(200).json({ mensaje: "Documento eliminado", datos: documentoEliminado });
}
