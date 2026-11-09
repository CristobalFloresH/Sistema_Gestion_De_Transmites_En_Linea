// Guarda en el navegador (IndexedDB) los PDF que cada usuario sube en "Mis documentos".
// IndexedDB permite guardar archivos completos (localStorage solo guarda texto y se llena rapido).
// Cada documento se identifica por el RUT del usuario y el tipo de documento (cedula, residencia, ...),
// asi dos personas que usan el mismo computador no ven los archivos del otro.
const BD = 'documentos-usuario';
const TABLA = 'archivos';

function abrirBD() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Tu navegador no permite guardar archivos'));
      return;
    }
    const peticion = indexedDB.open(BD, 1);
    peticion.onupgradeneeded = () => peticion.result.createObjectStore(TABLA, { keyPath: 'clave' });
    peticion.onsuccess = () => resolve(peticion.result);
    peticion.onerror = () => reject(peticion.error);
  });
}

// Ejecuta una operacion dentro de una transaccion y cierra la conexion al terminar
async function operar(modo, accion) {
  const bd = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = bd.transaction(TABLA, modo);
    const peticion = accion(tx.objectStore(TABLA));
    tx.oncomplete = () => { bd.close(); resolve(peticion?.result); };
    tx.onerror = () => { bd.close(); reject(tx.error); };
    tx.onabort = () => { bd.close(); reject(tx.error); };
  });
}

// Devuelve los documentos guardados de un usuario: [{ id, nombreArchivo, tamano, subido, blob }]
export async function listarDocumentos(rut) {
  const todos = await operar('readonly', (tabla) => tabla.getAll());
  return todos.filter((d) => d.rut === rut);
}

// Guarda (o reemplaza) el PDF de un tipo de documento
export function guardarDocumento(rut, id, archivo) {
  return operar('readwrite', (tabla) => tabla.put({
    clave: `${rut}:${id}`,
    rut,
    id,
    nombreArchivo: archivo.name,
    tamano: archivo.size,
    subido: new Date().toISOString(),
    blob: archivo,
  }));
}

export function eliminarDocumento(rut, id) {
  return operar('readwrite', (tabla) => tabla.delete(`${rut}:${id}`));
}
