import api from './api';

// Registra un documento de un tramite. Por ahora solo se guarda el nombre del archivo:
// el PDF no se sube (la subida real queda para la entrega final)
export async function crearDocumento(idTramite, idTipoDocumento, nombreArchivo) {
  const respuesta = await api.post('/documentos', {
    id_tramite: idTramite,
    id_tipo_documento: idTipoDocumento,
    nombre_archivo: nombreArchivo,
  });
  return respuesta.data.datos;
}

// Documentos de un tramite, con su tipo y su estado de revision
export async function listarDocumentos(idTramite) {
  const respuesta = await api.get('/documentos', { params: { id_tramite: idTramite } });
  return respuesta.data.datos;
}
