import jwt from "jsonwebtoken";

const SECRETO = process.env.JWT_SECRET;


if (!SECRETO) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}
//Se define el tiempo de vida del token
const EXPIRACION = process.env.JWT_EXPIRES_IN || "2h";

//Funcion de creacion
export function firmarToken(payload) {
  return jwt.sign(payload, SECRETO, { algorithm: "HS256", expiresIn: EXPIRACION });
}

//Funcion de validacion
export function verificarJwt(token) {
  return jwt.verify(token, SECRETO, { algorithms: ["HS256"] });
}