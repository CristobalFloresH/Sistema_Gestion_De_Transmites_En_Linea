import { responderError } from "../utils/apoyoControladores.js";

// Campos que pueden llevar cualquier símbolo, porque nunca se muestran en pantalla
const camposExentos = ["password"];

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