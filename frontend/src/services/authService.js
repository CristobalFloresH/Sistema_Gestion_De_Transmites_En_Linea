import api from './api'; //Instancia de Axios
import { guardarSesion, borrarSesion, getToken, getUsuario } from './sesion';

//Iniciar sesion
export async function login(rut, password) {
  //Hace peticion POST y se envia rut y contraseña al backend
  const { data } = await api.post('/auth/login', { rut, password });
  guardarSesion(data.token, data.datos);
  return data.datos;
}

//Cerrar sesion
export function logout() {
  borrarSesion();
}
export { getToken, getUsuario };