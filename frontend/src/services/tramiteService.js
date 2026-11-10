import api from './api';

// Crea un tramite nuevo; el backend lo deja en estado "Cita reservada"
export async function crearTramite(rutCiudadano, idTipoTramite) {
  const respuesta = await api.post('/tramites', {
    rut_ciudadano: rutCiudadano,
    id_tipo_tramite: idTipoTramite,
  });
  return respuesta.data.datos;
}

// Tramites visibles para quien inicio sesion (a un ciudadano el backend solo le devuelve los suyos).
// Filtros opcionales, por ejemplo { rut_ciudadano: '20123456-5' }
export async function listarTramites(filtros) {
  const respuesta = await api.get('/tramites', { params: filtros });
  return respuesta.data.datos;
}

// Cambia el estado de un tramite (el backend lo anota en el historial)
export async function cambiarEstadoTramite(idTramite, idEstadoTramite) {
  const respuesta = await api.patch(`/tramites/${idTramite}`, { id_estado_tramite: idEstadoTramite });
  return respuesta.data.datos;
}

// Un tramite con su historial de estados
export async function obtenerTramite(idTramite) {
  const respuesta = await api.get(`/tramites/${idTramite}`);
  return respuesta.data.datos;
}
