import api from './api';

// Bloques activos de un dia, para que el ciudadano elija hora en el calendario
export async function listarBloquesPorFecha(fecha) {
  const respuesta = await api.get('/bloques_horarios', { params: { fecha, activo: true } });
  return respuesta.data.datos;
}

// Todos los bloques de un dia, activos y desactivados, para la pantalla del funcionario
export async function listarTodosLosBloques(fecha) {
  const respuesta = await api.get('/bloques_horarios', { params: { fecha } });
  return respuesta.data.datos;
}

// Crea un bloque nuevo; el backend solo acepta lunes a viernes entre las 08:00 y las 17:00
export async function crearBloque(datos) {
  const respuesta = await api.post('/bloques_horarios', datos);
  return respuesta.data.datos;
}

// Cambia solo lo enviado de un bloque, por ejemplo { cupos: 5 } o { activo: false }
export async function actualizarBloque(idBloqueHorario, camposNuevos) {
  const respuesta = await api.patch(`/bloques_horarios/${idBloqueHorario}`, camposNuevos);
  return respuesta.data.datos;
}

// Borra un bloque que nunca tuvo citas; si las tuvo, el backend responde 409 y hay que desactivarlo
export async function eliminarBloque(idBloqueHorario) {
  const respuesta = await api.delete(`/bloques_horarios/${idBloqueHorario}`);
  return respuesta.data.datos;
}
