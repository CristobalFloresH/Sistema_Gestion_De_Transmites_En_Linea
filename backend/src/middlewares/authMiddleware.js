import { verificarJwt } from "../utils/jwt.js";
import { responderError, leerIdDeLaUrl, leerIdDeLaConsulta, esIdValido } from "../utils/apoyoControladores.js";
import { buscarCitaPorId } from "../services/citaService.js";
import { buscarTramitePorId } from "../services/tramiteService.js";
import { buscarDocumentoPorId } from "../services/documentoService.js";

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

//Evita que un ciudadano cancele o mueva la cita de otra persona
export async function ciudadanoSoloSusCitas(req, res, next) {
  const idCita = leerIdDeLaUrl(req);
  //Si el id no es valido o la cita no existe, el controlador responde 400 o 404
  if (req.usuario?.rol !== "ciudadano" || !idCita) return next();

  const cita = await buscarCitaPorId(idCita);
  if (cita && cita.rut_ciudadano !== req.usuario.rut) {
    return responderError(res, 403, "Solo puedes ver o modificar tus propias citas.");
  }
  next();
}

//Arma un middleware que evita que un ciudadano vea o cambie datos de un tramite ajeno.
//obtenerIdTramite dice de donde sale el id del tramite en cada ruta (el personal no tiene esta restriccion)
function ciudadanoSoloSusTramites(obtenerIdTramite) {
  return async (req, res, next) => {
    if (req.usuario?.rol !== "ciudadano") return next();

    const idTramite = await obtenerIdTramite(req);
    //Si el id no es valido o el dato no existe, el controlador responde 400 o 404
    if (!esIdValido(idTramite)) return next();

    const tramite = await buscarTramitePorId(idTramite);
    if (tramite && tramite.rut_ciudadano !== req.usuario.rut) {
      return responderError(res, 403, "Solo puedes acceder a tus propios trámites.");
    }
    next();
  };
}

//El id del tramite viene en la URL: /tramites/:id
export const ciudadanoSoloSuTramite = ciudadanoSoloSusTramites((req) => leerIdDeLaUrl(req));

//El id del tramite viene en el cuerpo: crear una cita o un documento
export const ciudadanoSoloSuTramiteEnElCuerpo = ciudadanoSoloSusTramites((req) => req.body?.id_tramite);

//El id del tramite sale del documento: /documentos/:id
export const ciudadanoSoloSusDocumentos = ciudadanoSoloSusTramites(async (req) => {
  const idDocumento = leerIdDeLaUrl(req);
  const documento = idDocumento ? await buscarDocumentoPorId(idDocumento) : undefined;
  return documento?.id_tramite;
});

//Un ciudadano solo puede listar los documentos de uno de sus tramites (?id_tramite=)
const ciudadanoSoloSuTramiteEnLaConsulta = ciudadanoSoloSusTramites((req) => leerIdDeLaConsulta(req.query.id_tramite));

export function ciudadanoSoloDocumentosDeSusTramites(req, res, next) {
  if (req.usuario?.rol === "ciudadano" && leerIdDeLaConsulta(req.query.id_tramite) === null) {
    return responderError(res, 403, "Indica uno de tus trámites con ?id_tramite= para ver sus documentos.");
  }
  return ciudadanoSoloSuTramiteEnLaConsulta(req, res, next);
}