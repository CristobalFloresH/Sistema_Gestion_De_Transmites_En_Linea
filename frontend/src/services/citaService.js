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

// Cancela una cita; el backend libera su cupo en el bloque
export async function cancelarCita(idCita) {
  const respuesta = await api.patch(`/citas/${idCita}`, { vigente: false });
  return respuesta.data.datos;
}

// Mueve una cita a otro bloque; el backend revisa que tenga cupo y que no haya pasado
export async function reagendarCita(idCita, idBloqueHorario) {
  const respuesta = await api.patch(`/citas/${idCita}`, { id_bloque_horario: idBloqueHorario });
  return respuesta.data.datos;
}

// Todas las citas, vigentes y canceladas (la agenda del funcionario muestra tambien las de tramites rechazados)
export async function listarCitas(filtros) {
  const respuesta = await api.get('/citas', { params: filtros });
  return respuesta.data.datos;
}

// Citas vigentes (a un ciudadano el backend solo le devuelve las suyas).
// Filtros opcionales, por ejemplo { rut_ciudadano: '20123456-5' }
export async function listarCitasVigentes(filtros) {
  const respuesta = await api.get('/citas', { params: { ...filtros, vigente: true } });
  return respuesta.data.datos;
}
