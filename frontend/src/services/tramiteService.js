import api from './api';

// Crea un tramite nuevo; el backend lo deja en estado "Cita reservada"
export async function crearTramite(rutCiudadano, idTipoTramite) {
  const respuesta = await api.post('/tramites', {
    rut_ciudadano: rutCiudadano,
    id_tipo_tramite: idTipoTramite,
  });
  return respuesta.data.datos;
}
