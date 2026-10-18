import api from './api';

// Tipos de tramite, cada uno con los documentos que pide
export async function listarTiposTramite() {
  const respuesta = await api.get('/tipos_tramite');
  return respuesta.data.datos;
}

// Formas de avisarle al ciudadano (correo, WhatsApp)
export async function listarMetodosNotificacion() {
  const respuesta = await api.get('/metodos_notificacion');
  return respuesta.data.datos;
}
