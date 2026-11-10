import { randomUUID, createHash } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

// Funciones para guardar en disco los PDF que suben los ciudadanos: comprobar que de verdad sean PDF,
// calcular su huella y escribirlos con un nombre único. La base solo guarda la ruta y la huella.

// Carpeta donde quedan los archivos subidos. Se puede cambiar con CARPETA_SUBIDAS en el .env.
// Es relativa a donde se ejecuta el servidor (la carpeta backend), y está excluida de git.
const carpetaSubidas = process.env.CARPETA_SUBIDAS ?? "uploads";

// Todo PDF empieza con estos cinco bytes; así se descarta un archivo con otro contenido al que le cambiaron la extensión
export function esPdf(contenido) {
  return contenido.length > 5 && contenido.subarray(0, 5).toString("latin1") === "%PDF-";
}

// Huella SHA-256 del archivo en hexadecimal, para poder comprobar después que nadie lo reemplazó
export function calcularHash(contenido) {
  return createHash("sha256").update(contenido).digest("hex");
}

// Escribe el archivo con un nombre único y devuelve la ruta que se guarda en la base.
// El nombre original no se usa como nombre de archivo: así nadie puede elegir dónde ni con qué nombre se escribe.
export async function guardarPdf(contenido) {
  await mkdir(carpetaSubidas, { recursive: true });
  const nombreEnDisco = `${randomUUID()}.pdf`;
  await writeFile(path.join(carpetaSubidas, nombreEnDisco), contenido);
  return path.posix.join(carpetaSubidas, nombreEnDisco);
}

// Borra un archivo guardado. Si ya no está, no pasa nada: la idea es no dejar basura en disco.
export async function borrarPdf(ruta) {
  if (!ruta) return;
  await unlink(ruta).catch(() => {});
}
