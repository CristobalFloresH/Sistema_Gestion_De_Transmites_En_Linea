import api from './api';

export async function listarBloquesPorFecha(fecha) {
  const respuesta = await api.get('/bloques_horarios', { params: { fecha, activo: true } });
  return respuesta.data.datos;
}