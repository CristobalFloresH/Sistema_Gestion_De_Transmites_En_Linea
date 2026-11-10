import rateLimit from "express-rate-limit";

// Freno contra la fuerza bruta: limita los intentos fallidos de inicio de sesión desde una misma IP
export const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  limit: 10, // máximo de intentos fallidos por IP dentro de esa ventana
  skipSuccessfulRequests: true, // un login correcto no suma al contador
  standardHeaders: "draft-7", // informa el estado del límite en las cabeceras RateLimit
  legacyHeaders: false,
  message: {
    error: { estado: 429, mensaje: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
  },
});