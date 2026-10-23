import api from './api'; //Instancia de Axios
import { guardarSesion, borrarSesion, getToken, getUsuario } from './sesion';

//Iniciar sesion: acceso indica desde que pantalla se entra ('ciudadano' o 'funcionario')
export async function login(rut, password, acceso) {
  //Hace peticion POST y se envia rut, contraseña y tipo de acceso al backend
  const { data } = await api.post('/auth/login', { rut, password, acceso });
  guardarSesion(data.token, data.datos);
  return data.datos;
}

//Alta de usuario: solo la puede hacer un administrador con sesion iniciada (el token va en el interceptor)
export async function registrar({ rut, nombre, correo, telefono, password, rol }) {
  //Hace peticion POST al backend, enviando los datos
  const { data } = await api.post('/auth/registro', {
    rut,
    nombre,
    correo,
    telefono: telefono || undefined, 
    password,
    rol,
  });
  //Se devuelve respuesta
  return data;
}

//Cerrar sesion
export function logout() {
  borrarSesion();
}
export { getToken, getUsuario };