// Estados del catalogo estado_documento (licencias.sql)
export const ID_DOCUMENTO_PENDIENTE = 1;
export const ID_DOCUMENTO_APROBADO = 2;
export const ID_DOCUMENTO_RECHAZADO = 3;

// Deja un solo documento por tipo: el mas reciente. Un tramite puede tener varios del mismo tipo,
// porque cuando uno se rechaza el ciudadano sube otro, y solo el ultimo cuenta.
// La API los entrega ordenados de mas antiguo a mas nuevo, asi que el ultimo de cada tipo gana.
export function vigentesPorTipo(documentos) {
  const porTipo = new Map();
  documentos.forEach((documento) => porTipo.set(documento.id_tipo_documento, documento));
  return [...porTipo.values()];
}
