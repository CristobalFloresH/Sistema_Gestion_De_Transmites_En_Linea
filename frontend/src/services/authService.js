// Sesion simulada: solo recuerda el rol de quien entro.
const CLAVE_STORAGE = 'usuario';

export function login(rol) {
  const usuario = { rol };
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuario));
  return usuario;
}

export function logout() {
  localStorage.removeItem(CLAVE_STORAGE);
}

export function getUsuario() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  return guardado ? JSON.parse(guardado) : null;
}
