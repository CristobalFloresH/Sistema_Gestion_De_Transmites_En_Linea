const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

function leerPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function guardarSesion(token, usuario) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}

export function getToken() {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (!token) return null;
  const payload = leerPayload(token);
  if (!payload || payload.exp * 1000 <= Date.now()) {
    borrarSesion();
    return null;
  }
  return token;
}

export function getUsuario() {
  if (!getToken()) return null;
  const guardado = localStorage.getItem(CLAVE_USUARIO);
  try {
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}