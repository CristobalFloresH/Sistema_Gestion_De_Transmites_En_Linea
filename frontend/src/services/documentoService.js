import api from './api';

// Sube el PDF de un tramite. Va como multipart/form-data porque lleva el archivo:
// el backend comprueba que sea un PDF de verdad, lo guarda y anota su huella SHA-256
export async function crearDocumento(idTramite, idTipoDocumento, archivo) {
  const datos = new FormData();
  datos.append('id_tramite', idTramite);
  datos.append('id_tipo_documento', idTipoDocumento);
  datos.append('archivo', archivo);
  const respuesta = await api.post('/documentos', datos);
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
