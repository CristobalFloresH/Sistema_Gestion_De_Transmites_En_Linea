import bcrypt from "bcrypt";

// Cuántas veces bcrypt repite su cálculo. Más vueltas = más difícil de adivinar por fuerza bruta, pero más lento.
// 10 es el valor que se usa normalmente.
const rondasDeSalt = 10;

// Convierte una contraseña en un hash que se puede guardar en la base de datos (columna clave_hash)
export async function hashearClave(claveEnTextoPlano) {
  return bcrypt.hash(claveEnTextoPlano, rondasDeSalt);
}

// Revisa si una contraseña escrita por el usuario corresponde al hash guardado. Devuelve true o false
export async function compararClave(claveEnTextoPlano, claveHash) {
  return bcrypt.compare(claveEnTextoPlano, claveHash);
}