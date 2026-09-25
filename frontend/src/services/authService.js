// Usuarios de prueba
const USUARIOS = [
  { rut: '12.345.678-9', clave: '1234', nombre: 'Juan Lopez', rol: 'ciudadano' },
  { rut: '11.111.111-1', clave: '1234', nombre: 'Maria Soto', rol: 'funcionario' },
];

const CLAVE_STORAGE = 'usuario';

export function login(rut, clave) {
  const usuario = USUARIOS.find((u) => u.rut === rut && u.clave === clave);
  if (!usuario) return null;

  const datos = { rut: usuario.rut, nombre: usuario.nombre, rol: usuario.rol };
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
  return datos;
}

export function logout() {
  localStorage.removeItem(CLAVE_STORAGE);
}

export function getUsuario() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  return guardado ? JSON.parse(guardado) : null;
}
