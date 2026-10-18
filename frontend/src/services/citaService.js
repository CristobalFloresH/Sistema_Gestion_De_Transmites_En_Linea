import api from './api';

// Reserva una cita para un tramite en un bloque horario
export async function crearCita(idTramite, idBloqueHorario, idMetodoNotificacion) {
  const respuesta = await api.post('/citas', {
    id_tramite: idTramite,
    id_bloque_horario: idBloqueHorario,
    id_metodo_notificacion: idMetodoNotificacion,
  });
  return respuesta.data.datos;
}
