// Genera el hash bcrypt de una contraseña para guardarla en licencias.sql (usuarios de prueba).
// Antes revisa que la contraseña sea segura. Uso: npm run hash -- "Clave123!"
import { validarClave } from "../src/utils/validacionClave.js";
import { hashearClave } from "../src/utils/claves.js";

const clave = process.argv[2];
const errores = validarClave(clave);

if (errores.length > 0) {
  console.error("La contraseña no es segura:");
  for (const error of errores) console.error(`- ${error}`);
  process.exit(1);
}

const hash = await hashearClave(clave);
console.log("La contraseña es segura. Hash generado:");
console.log(hash);
