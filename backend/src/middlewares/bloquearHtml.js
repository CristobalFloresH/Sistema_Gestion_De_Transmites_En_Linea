import { responderError } from "../utils/apoyoControladores.js";

// Campos que pueden llevar cualquier símbolo: la clave nunca se muestra, y el motivo del rechazo es
// texto libre del funcionario (por ejemplo "la foto mide < 2 cm") que React escapa al mostrarlo
// (comentario ajustado al agregar motivo_rechazo)
const camposExentos = ["password", "motivo_rechazo"];

// Revisa si un texto trae < o >, los símbolos necesarios para escribir una etiqueta HTML (<script>, <img>, etc.)
const contieneHtml = (texto) => /[<>]/.test(texto);

// Frena los textos con etiquetas HTML antes de que lleguen a la base de datos (defensa contra XSS almacenado)
export function bloquearHtml(req, res, next) {
  const datos = req.body ?? {};
  const camposConHtml = Object.entries(datos)
    .filter(([campo, valor]) => !camposExentos.includes(campo) && typeof valor === "string" && contieneHtml(valor))
    .map(([campo]) => `${campo} no puede contener los símbolos < ni >`);

  if (camposConHtml.length > 0) {
    return responderError(res, 400, "Datos inválidos", camposConHtml);
  }
  next();
}