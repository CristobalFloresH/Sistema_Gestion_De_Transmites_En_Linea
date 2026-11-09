import * as catalogoService from "../services/catalogoService.js";

// Este archivo recibe las peticiones de los catálogos. Como solo se leen, cada función pide la lista al servicio
// y la devuelve con 200; el frontend las usa para llenar las opciones de sus formularios.

// GET /api/tipos_tramite
// Devuelve los tipos de trámite con su duración y los documentos que pide cada uno.
export async function listarTiposTramite(req, res) {
  res.status(200).json({ datos: await catalogoService.buscarTiposTramite() });
}

// GET /api/tipos_documento
// Devuelve los tipos de documento.
export async function listarTiposDocumento(req, res) {
  res.status(200).json({ datos: await catalogoService.buscarTiposDocumento() });
}

// GET /api/estados_tramite
// Devuelve los estados de un trámite.
export async function listarEstadosTramite(req, res) {
  res.status(200).json({ datos: await catalogoService.buscarEstadosTramite() });
}

// GET /api/estados_documento
// Devuelve los estados de un documento.
export async function listarEstadosDocumento(req, res) {
  res.status(200).json({ datos: await catalogoService.buscarEstadosDocumento() });
}

// GET /api/metodos_notificacion
// Devuelve los métodos de notificación.
export async function listarMetodosNotificacion(req, res) {
  res.status(200).json({ datos: await catalogoService.buscarMetodosNotificacion() });
}

// GET /api/roles
// Devuelve los roles de usuario.
export async function listarRoles(req, res) {
  res.status(200).json({ datos: await catalogoService.buscarRoles() });
}
