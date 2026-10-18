// Formatea una fecha AAAA-MM-DD, por ejemplo "octubre de 2026" o "19 de octubre"
export function formatear(fechaIso, opciones) {
  return new Date(`${fechaIso}T12:00:00`).toLocaleDateString('es-CL', opciones);
}

// Fecha de hoy en formato AAAA-MM-DD (hora local, no UTC)
export function hoyIso() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}
