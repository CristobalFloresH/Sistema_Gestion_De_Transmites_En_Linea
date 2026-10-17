import { verificarJwt } from "../utils/jwt.js";
import { responderError } from "../utils/apoyoControladores.js";

//Verifica que el usuario haya iniciado sesion y tenga un token valido
export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  //revisa si el frontend envio el token 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return responderError(res, 401, "Acceso denegado. Token faltante o formato incorrecto.");
  }
  const token = authHeader.split(" ")[1];

  try {
    //Desencripta el token y guarda los datos del usuario
    req.usuario = verificarJwt(token);
    next();
  } catch (error) {
    //Manejo de errores JWT
    if (error.name === "TokenExpiredError") {
      return responderError(res, 401, "El token ha expirado. Inicie sesión nuevamente.");
    }
    return responderError(res, 401, "Token inválido.");
  }
}

//Filtro por roles
export function autorizarRoles(...rolesPermitidos) {
  return (req, res, next) => {
    //Se revisa si el rol esta dentro de la lista de roles permitidos para la ruta
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return responderError(res, 403, "Acceso denegado. Rol no autorizado para esta acción.");
    }
    next();
  };
}
//Permite el acceso si es el dueño de los datos 0 tiene un rol que lo permita
export function autorizarPropioORoles(...rolesPermitidos) {
  return (req, res, next) => {
    //Compara ruts
    const esPropio = req.usuario?.rut === req.params.rut;
    if (esPropio || rolesPermitidos.includes(req.usuario?.rol)) return next();
    return responderError(res, 403, "Acceso denegado. Solo puedes ver tus propios datos.");
  };
}

//Se fuerza que los ciudadanos solo vean sus listados
export function limitarListadoAlCiudadano(req, res, next) {
  if (req.usuario?.rol === "ciudadano") {
    const consulta = { ...req.query, rut_ciudadano: req.usuario.rut };
    // En Express 5 req.query es de solo lectura, por eso se redefine
    Object.defineProperty(req, "query", { value: consulta, writable: true, configurable: true });
  }
  next();
}

//Evita que un ciudadano cree un tramite haciendosee pasar por otro
export function ciudadanoSoloSuRut(req, res, next) {
  if (req.usuario?.rol === "ciudadano" && req.body?.rut_ciudadano !== req.usuario.rut) {
    return responderError(res, 403, "Solo puedes crear trámites a tu propio nombre.");
  }
  next();
}