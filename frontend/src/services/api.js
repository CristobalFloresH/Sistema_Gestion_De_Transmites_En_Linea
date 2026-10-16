import axios from 'axios';

// Cliente unico para hablar con el backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Traduce cualquier error a un mensaje legible para mostrar en pantalla
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response) {
      error.mensaje = error.response.data?.error?.mensaje ?? 'Ocurrió un error inesperado';
    } else {
      error.mensaje = 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.';
    }
    return Promise.reject(error);
  }
);

export default api;
