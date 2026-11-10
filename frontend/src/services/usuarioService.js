import api from './api';

// Datos de un usuario segun su RUT. Un ciudadano solo puede pedir los suyos;
// el funcionario y el administrador pueden pedir los de cualquiera
export async function obtenerUsuario(rut) {
  const respuesta = await api.get(`/usuarios/${rut}`);
  return respuesta.data.datos;
}
