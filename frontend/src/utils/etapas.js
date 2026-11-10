// Ids del catalogo estado_tramite (licencias.sql)
export const ID_CITA_RESERVADA = 1;
export const ID_LISTA_PARA_RETIRO = 6;
export const ID_RECHAZADO = 7;

// Nombre corto de cada estado, para la barra de progreso y los botones
const NOMBRES = { 1: 'Cita', 2: 'Teorico', 3: 'Psicotecnico', 8: 'Practico', 4: 'Foto', 5: 'Impresion', 6: 'Retiro' };

// Estados por los que pasa cada tipo de tramite, en orden (id_tipo_tramite: estados)
const RECORRIDOS = {
  1: [1, 2, 3, 8, 4, 5, 6], // primera vez
  2: [1, 3, 4, 5, 6], // renovacion: sin teorico ni practico
  3: [1, 4, 5, 6], // reimpresion: sin examenes
};

function recorridoDe(idTipo) {
  return RECORRIDOS[idTipo] ?? RECORRIDOS[1];
}

// Nombres de los pasos de la barra para un tipo de tramite
export function etapasDe(idTipo) {
  return recorridoDe(idTipo).map((idEstado) => NOMBRES[idEstado]);
}

// Posicion del estado actual en la barra (0 = Cita)
export function pasoActual(idTipo, idEstado) {
  return Math.max(recorridoDe(idTipo).indexOf(idEstado), 0);
}

// Estado al que se avanza desde el actual, o null si el tramite ya termino (o fue rechazado)
export function siguienteEstado(idTipo, idEstado) {
  const recorrido = recorridoDe(idTipo);
  const posicion = recorrido.indexOf(idEstado);
  return posicion >= 0 && posicion < recorrido.length - 1 ? recorrido[posicion + 1] : null;
}

export function nombreEtapa(idEstado) {
  return NOMBRES[idEstado];
}

// Cita cancelada de un tramite que sigue en "Cita reservada" y no tiene otra vigente
// ("Cita cancelada" no es un estado de la base; si el tramite se rechazo, se muestra "Rechazado")
export function buscarCitaCancelada(tramite, citas) {
  const delTramite = citas.filter((c) => c.id_tramite === tramite.id_tramite);
  return tramite.id_estado_tramite === ID_CITA_RESERVADA && !delTramite.some((c) => c.vigente)
    ? delTramite.find((c) => !c.vigente)
    : undefined;
}
