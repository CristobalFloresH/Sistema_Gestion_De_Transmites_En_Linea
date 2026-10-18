// Reglas para que una contraseña sea segura. Devuelve la lista de problemas: si está vacía, la contraseña es válida.
const largoMinimo = 8;
// bcrypt solo usa los primeros 72 bytes de la contraseña, y un máximo evita que manden textos enormes
const largoMaximo = 72;

export function validarClave(password) {
  if (typeof password !== "string") return ["password es obligatorio"];

  const errores = [];
  if (password.length < largoMinimo) errores.push(`password debe tener al menos ${largoMinimo} caracteres`);
  if (Buffer.byteLength(password, "utf8") > largoMaximo) errores.push(`password no puede superar los ${largoMaximo} bytes`);
  if (!/[a-z]/.test(password)) errores.push("password debe incluir una letra minúscula");
  if (!/[A-Z]/.test(password)) errores.push("password debe incluir una letra mayúscula");
  if (!/[0-9]/.test(password)) errores.push("password debe incluir un número");
  if (!/[^A-Za-z0-9]/.test(password)) errores.push("password debe incluir un símbolo (por ejemplo ! o #)");
  return errores;
}