// Funciones pequeñas que comparten los controladores (trámites, citas, documentos, usuarios y catálogos):
// el formato de las respuestas de error y las validaciones que se repiten.

// Códigos que usa PostgreSQL para avisar ciertos errores, para poder responder con un mensaje claro
export const errorPostgresDuplicado = "23505"; // se repite un valor que debe ser único
export const errorPostgresReferencia = "23503"; // se apunta a un registro que no existe (llave foránea)

// Envía una respuesta de error con un formato uniforme: el código, un mensaje y, si hay, el detalle
export function responderError(res, estado, mensaje, detalles) {
  const error = { estado, mensaje };
  if (detalles) error.detalles = detalles;
  return res.status(estado).json({ error });
}

// Revisa que el texto sea una fecha real escrita como AAAA-MM-DD (por ejemplo, rechaza el 30 de febrero)
export function esFechaValida(texto) {
  if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const fecha = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().startsWith(texto);
}

// Revisa que el RUT venga normalizado, sin puntos y con guion (por ejemplo 12345678-9), igual que en la base de datos
export function esRutValido(texto) {
  return typeof texto === "string" && /^[0-9]{7,8}-[0-9Kk]$/.test(texto);
}

// Revisa que el valor sea un texto con contenido (no solo espacios) y que no pase del largo máximo permitido
export function esTextoValido(valor, largoMaximo) {
  return typeof valor === "string" && valor.trim().length > 0 && valor.length <= largoMaximo;
}

// Revisa que el valor sea un número entero mayor que 0, como los id de las tablas
export function esIdValido(valor) {
  return Number.isInteger(valor) && valor > 0;
}

// Toma el id que viene en la URL y lo devuelve como número; si no es un número válido, devuelve null
export function leerIdDeLaUrl(req) {
  const id = Number(req.params.id);
  return esIdValido(id) ? id : null;
}

// Convierte un id que llega como texto en la URL (?id_algo=2) a número; si no viene, devuelve null.
// Si viene pero no es válido, devuelve NaN para que el controlador responda 400.
export function leerIdDeLaConsulta(texto) {
  if (texto === undefined || texto === "") return null;
  const id = Number(texto);
  return esIdValido(id) ? id : NaN;
}

// Devuelve la lista de campos enviados que no están entre los permitidos
export function buscarCamposDesconocidos(datos, camposPermitidos) {
  return Object.keys(datos).filter((nombreCampo) => !camposPermitidos.includes(nombreCampo));
}
