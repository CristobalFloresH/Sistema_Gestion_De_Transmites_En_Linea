import api from './api'; //Instancia de Axios
import { guardarSesion, borrarSesion, getToken, getUsuario } from './sesion';

//Iniciar sesion
export async function login(rut, password) {
  //Hace peticion POST y se envia rut y contraseña al backend
  const { data } = await api.post('/auth/login', { rut, password });
  guardarSesion(data.token, data.datos);
  return data.datos;
}

//Alta de una cuenta. No hay registro publico: el backend exige token de administrador,
//asi que esto solo se usa desde la pantalla de gestion de funcionarios
export async function registrar({ rut, nombre, correo, telefono, password }) {
  //Hace peticion POST al backend, enviando los datos
  const { data } = await api.post('/auth/registro', {
    rut,
    nombre,
    correo,
    telefono: telefono || undefined, 
    password,
  });
  //Se devuelve respuesta
  return data;
}

//Cerrar sesion
export function logout() {
  borrarSesion();
}
export { getToken, getUsuario };