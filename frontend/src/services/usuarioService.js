import api from './api';

// Datos de un usuario segun su RUT. Un ciudadano solo puede pedir los suyos;
// el funcionario y el administrador pueden pedir los de cualquiera
export async function obtenerUsuario(rut) {
  const respuesta = await api.get(`/usuarios/${rut}`);
  return respuesta.data.datos;
}

// Usuarios filtrados por rol o por si estan activos, por ejemplo { id_rol: 2 }
export async function listarUsuarios(filtros) {
  const respuesta = await api.get('/usuarios', { params: filtros });
  return respuesta.data.datos;
}

// Cambia solo lo enviado de un usuario, por ejemplo { activo: false } o { nombre: 'Ana' }.
// Solo el administrador puede hacerlo, y el backend no lo deja dejarse fuera a si mismo
export async function actualizarUsuario(rut, camposNuevos) {
  const respuesta = await api.patch(`/usuarios/${rut}`, camposNuevos);
  return respuesta.data.datos;
}
