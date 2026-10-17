import axios from 'axios';
import { getToken, borrarSesion } from './sesion';

// Cliente unico para hablar con el backend
const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10000,
});

// Antes de cada peticion: si hay sesion, agrega el token JWT
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Traduce cualquier error a un mensaje legible para mostrar en pantalla
function crearMensaje(error) {
  if (!error.response) {
    return error.code === 'ECONNABORTED'
      ? 'El servidor tardó demasiado en responder. Intenta de nuevo.'
      : 'No se pudo conectar con el servidor. Revisa tu conexión o inténtalo nuevamente.';
  }
  const { status, data } = error.response;
  const mensaje = data?.error?.mensaje;
  const detalles = data?.error?.detalles;
  if (mensaje) {
    return detalles?.length ? `${mensaje} (${detalles.join('; ')})` : mensaje;
  }
  if (status === 403) return 'No tienes permiso para hacer esto.';
  if (status === 404) return 'No se encontró lo que buscabas.';
  return status >= 500
    ? 'Hubo un problema en el servidor. Intenta más tarde.'
    : 'Ocurrió un error. Intenta de nuevo.';
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const status = error.response?.status;
    const eraElLogin = error.config?.url?.includes('/auth/login');

    // Token vencido o invalido: se cierra la sesion y se vuelve al login
    if (status === 401 && !eraElLogin) {
      borrarSesion();
      window.location.href = '/login';
    }

    const errorLegible = new Error(crearMensaje(error));
    errorLegible.mensaje = errorLegible.message; // el Calendario lee e.mensaje
    errorLegible.status = status;
    return Promise.reject(errorLegible);
  }
);

export default api;