// Guarda en el navegador lo que el usuario va eligiendo durante la reserva
// (tipo de tramite -> dia y hora -> documentos -> proceso completado)
const CLAVE = 'reserva';

export function leerReserva() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE)) ?? {};
  } catch {
    return {};
  }
}

export function guardarReserva(parcial) {
  sessionStorage.setItem(CLAVE, JSON.stringify({ ...leerReserva(), ...parcial }));
}

export function limpiarReserva() {
  sessionStorage.removeItem(CLAVE);
}

// Tipo de tramite elegido, tal como vino del catalogo de la API (con sus documentos requeridos).
// Devuelve null si todavia no se elige o si quedo guardada una reserva con el formato antiguo
export function leerTipo() {
  const tipo = leerReserva().tipo;
  return tipo?.id_tipo_tramite ? tipo : null;
}
