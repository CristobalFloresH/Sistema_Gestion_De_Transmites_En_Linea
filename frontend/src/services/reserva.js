// Guarda en el navegador lo que el usuario va eligiendo durante la reserva
// (tipo de tramite -> dia y hora -> documentos -> proceso completado)
const CLAVE = 'reserva';

const DOC_RESIDENCIA = 'Certificado de residencia';
const DOC_CEDULA = 'Cedula de Identidad';
const DOC_EDUCACION = 'Certificado de educacion basica';

export const TIPOS_TRAMITE = [
  { value: 'primera_vez', titulo: 'Licencia (Primera Vez)', nombre: 'Licencia por primera vez', detalle: '30 min · 3 documentos', documentos: [DOC_RESIDENCIA, DOC_EDUCACION, DOC_CEDULA] },
  { value: 'renovacion', titulo: 'Renovacion', nombre: 'Renovacion de licencia', detalle: '20 min · 2 documentos', documentos: [DOC_RESIDENCIA, DOC_CEDULA] },
  { value: 'reimprimir', titulo: 'Re-imprimir', nombre: 'Reimpresion de licencia', detalle: '20 min · 2 documentos', documentos: [DOC_RESIDENCIA, DOC_CEDULA] },
];

export function buscarTipo(valor) {
  return TIPOS_TRAMITE.find((t) => t.value === valor) ?? null;
}

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
