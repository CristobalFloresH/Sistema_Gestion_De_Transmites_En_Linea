import * as authService from "../services/authService.js";
import { validarClave } from "../utils/validacionClave.js";
import { hashearClave, compararClave } from "../utils/claves.js";
import { firmarToken } from "../utils/jwt.js";
import {
  errorPostgresDuplicado,
  responderError,
  esRutValido,
  esTextoValido,
} from "../utils/apoyoControladores.js";

//Limpia el rut para guardarse en la BD
function normalizarRut(rut) {
  return typeof rut === "string" ? rut.replace(/[.\s]/g, "").toUpperCase() : rut;
}

//Validar formato del correo
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registrar(req, res) {
  //Si la petición llega sin cuerpo JSON, req.body es undefined: se usa un objeto vacío para no caerse
  const cuerpo = req.body ?? {};
  const { nombre, correo, telefono, password } = cuerpo;
  const rut = normalizarRut(cuerpo.rut);

  const errores = [];

  //Valida que el formato y el largo sea el correcto
  if (!esRutValido(rut)) errores.push("rut debe tener formato 12345678-9");
  if (!esTextoValido(nombre, 60)) errores.push("nombre es obligatorio (máximo 60 caracteres)");
  if (typeof correo !== "string" || !formatoCorreo.test(correo) || correo.length > 100) {
    errores.push("correo no es válido");
  }
  if (telefono !== undefined && telefono !== null && !esTextoValido(telefono, 15)) {
    errores.push("telefono no es válido (máximo 15 caracteres)");
  }
  //Contraseña segura: largo, mayúscula, minúscula, número y símbolo
  errores.push(...validarClave(password));

  //Si hay errores, se le avisa al frontend
  if (errores.length > 0) return responderError(res, 400, "Datos inválidos", errores);

  try {
    //Verifica que el usuario no exista por el rut
    const existente = await authService.buscarUsuarioPorRut(rut);
    if (existente) return responderError(res, 409, "El usuario ya existe");

    //Hash en la contraseña
    const claveHash = await hashearClave(password);
    const nuevoUsuario = await authService.crearUsuario({ rut, nombre, correo, telefono, claveHash });

    res.status(201).json({ mensaje: "Usuario registrado con éxito", datos: nuevoUsuario });
  } catch (error) {
    //Se rechaza el usuario, ya que hay un usuario con el mismo correo
    if (error.code === errorPostgresDuplicado) {
      return responderError(res, 409, "Ya existe un usuario con ese correo");
    }
    console.error(error);
    responderError(res, 500, "Error al registrar usuario");
  }
}

export async function login(req, res) {
  //Si la petición llega sin cuerpo JSON, req.body es undefined: se usa un objeto vacío para no caerse
  const cuerpo = req.body ?? {};
  const { password } = cuerpo;
  const rut = normalizarRut(cuerpo.rut);

  //Se verifica que no falten datos y que la contraseña sea texto
  if (!rut || typeof password !== "string" || !password) {
    return responderError(res, 400, "Faltan credenciales");
  }

  try {
    //Busca al usuario por el rut
    const usuario = await authService.buscarUsuarioPorRut(rut);

    //Si no existe se rechaza el acceso
    if (!usuario || !usuario.activo) return responderError(res, 401, "Credenciales incorrectas");

    //Se valida la contraseña
    const claveValida = await compararClave(password, usuario.clave_hash);
    if (!claveValida) return responderError(res, 401, "Credenciales incorrectas");

    //Se crea el token enlazándolo al rut y al rol
    const token = firmarToken({ rut: usuario.rut, rol: usuario.rol });

    //Mensaje de éxito enviando el token al frontend
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      datos: { rut: usuario.rut, nombre: usuario.nombre, rol: usuario.rol },
    });
  } catch (error) {
    console.error(error);
    responderError(res, 500, "Error al iniciar sesión");
  }
}