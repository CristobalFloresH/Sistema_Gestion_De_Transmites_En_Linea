import api from './api';

// Crea un tramite nuevo; el backend lo deja en estado "Cita reservada"
export async function crearTramite(rutCiudadano, idTipoTramite) {
  const respuesta = await api.post('/tramites', {
    rut_ciudadano: rutCiudadano,
    id_tipo_tramite: idTipoTramite,
  });
  return respuesta.data.datos;
}

// Tramites visibles para quien inicio sesion (a un ciudadano el backend solo le devuelve los suyos)
export async function listarTramites() {
  const respuesta = await api.get('/tramites');
  return respuesta.data.datos;
}
