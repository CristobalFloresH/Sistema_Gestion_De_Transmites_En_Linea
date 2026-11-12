import api from './api';

// Sube el PDF de un tramite. Va como multipart/form-data porque lleva el archivo:
// el backend comprueba que sea un PDF de verdad, lo guarda y anota su huella SHA-256
export async function crearDocumento(idTramite, idTipoDocumento, archivo) {
  const datos = new FormData();
  datos.append('id_tramite', idTramite);
  datos.append('id_tipo_documento', idTipoDocumento);
  datos.append('archivo', archivo);
  // Un PDF de hasta 5 MB por una conexion lenta puede tardar mas que el limite normal del cliente,
  // y si se corta el reintento dejaria el documento duplicado
  const respuesta = await api.post('/documentos', datos, { timeout: 120000 });
  return respuesta.data.datos;
}

// Descarga el PDF de un documento (la peticion lleva el token) y devuelve una direccion
// temporal del navegador con la que se puede abrir en una pestaña
export async function abrirArchivo(idDocumento) {
  const respuesta = await api.get(`/documentos/${idDocumento}/archivo`, { responseType: 'blob' });
  return URL.createObjectURL(respuesta.data);
}

// Documentos de un tramite, con su tipo y su estado de revision
export async function listarDocumentos(idTramite) {
  const respuesta = await api.get('/documentos', { params: { id_tramite: idTramite } });
  return respuesta.data.datos;
}

// Aprueba o rechaza un documento. El rut del revisor lo saca el backend del token,
// no se manda en el cuerpo. Al rechazar hay que indicar el motivo
export async function revisarDocumento(idDocumento, idEstadoDocumento, motivoRechazo) {
  const respuesta = await api.patch(`/documentos/${idDocumento}`, {
    id_estado_documento: idEstadoDocumento,
    ...(motivoRechazo ? { motivo_rechazo: motivoRechazo } : {}),
  });
  return respuesta.data.datos;
}
