// Formatea una fecha AAAA-MM-DD, por ejemplo "octubre de 2026" o "19 de octubre"
export function formatear(fechaIso, opciones) {
  return new Date(`${fechaIso}T12:00:00`).toLocaleDateString('es-CL', opciones);
}
