import * as citaService from "../services/citaService.js";
import {
  errorPostgresDuplicado,
  errorPostgresReferencia,
  responderError,
  esFechaValida,
  esRutValido,
  esIdValido,
  leerIdDeLaUrl,
  leerIdDeLaConsulta,
  buscarCamposDesconocidos,
} from "../utils/apoyoControladores.js";

// Este archivo recibe las peticiones de citas: revisa que los datos sean correctos,
// le pide al servicio que haga el trabajo en la base de datos y decide qué responderle al cliente.

// Código HTTP y mensaje para cada motivo por el que el servicio no pudo reservar o editar la cita
const respuestasPorMotivoRechazo = {
  cita_inexistente: [404, "Cita no encontrada"],
  bloque_inexistente: [400, "No existe un bloque horario con ese id_bloque_horario"],
  bloque_inactivo: [409, "El bloque horario no está activo"],
  bloque_pasado: [409, "El bloque horario ya pasó"],
  sin_cupos: [409, "El bloque horario no tiene cupos disponibles"],
};

// Mensaje para cada dato que apunta a otra tabla, por si la base de datos avisa que ese registro no existe
const mensajesReferenciaInexistente = {
  cita_id_tramite_fkey: "No existe un trámite con ese id_tramite",
  cita_id_bloque_horario_fkey: "No existe un bloque horario con ese id_bloque_horario",
  cita_id_metodo_notificacion_fkey: "No existe un método de notificación con ese id_metodo_notificacion",
};

// ---------------------------------------------------------------------
// Funciones de apoyo
// ---------------------------------------------------------------------

// Revisa los datos para reservar una cita (POST) y devuelve la lista de problemas encontrados (vacía si todo está bien)
function validarDatosCreacion(datosCita) {
  const errores = [];

  const camposDesconocidos = buscarCamposDesconocidos(datosCita, citaService.columnasCreacion);
  if (camposDesconocidos.length > 0) errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);

  for (const nombreCampo of citaService.columnasCreacion) {
    const valor = datosCita[nombreCampo];
    if (valor === undefined) errores.push(`Falta el campo ${nombreCampo}`);
    else if (!esIdValido(valor)) errores.push(`${nombreCampo} debe ser un número entero mayor que 0`);
  }

  return errores;
}

// Revisa los datos para editar una cita y devuelve la lista de problemas encontrados.
// Al editar solo algunos campos (PATCH) no se exige que vengan todos.
function validarDatosEdicion(datosCita, { esParcial }) {
  const errores = [];

  const camposDesconocidos = buscarCamposDesconocidos(datosCita, citaService.columnasEditables);
  if (camposDesconocidos.length > 0) errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);

  if (!esParcial) {
    for (const nombreCampo of citaService.columnasEditables) {
      if (datosCita[nombreCampo] === undefined) errores.push(`Falta el campo ${nombreCampo}`);
    }
  }

  const { id_bloque_horario, id_metodo_notificacion, vigente } = datosCita;
  if (id_bloque_horario !== undefined && !esIdValido(id_bloque_horario)) {
    errores.push("id_bloque_horario debe ser un número entero mayor que 0");
  }
  if (id_metodo_notificacion !== undefined && !esIdValido(id_metodo_notificacion)) {
    errores.push("id_metodo_notificacion debe ser un número entero mayor que 0");
  }
  if (vigente !== undefined && typeof vigente !== "boolean") {
    errores.push("vigente debe ser true o false");
  }

  return errores;
}

// Responde al cliente según el resultado del servicio: el error que corresponda al motivo de rechazo,
// o la cita con el código de éxito indicado
function responderResultado(res, { cita, motivoRechazo }, estadoExito) {
  if (motivoRechazo) {
    const [estado, mensaje] = respuestasPorMotivoRechazo[motivoRechazo];
    return responderError(res, estado, mensaje);
  }
  if (estadoExito === 201) res.location(`/api/citas/${cita.id_cita}`);
  return res.status(estadoExito).json({ datos: cita });
}

// Si la base de datos rechazó la operación por un motivo conocido, responde al cliente con un mensaje claro.
// Devuelve false cuando es un error inesperado, para que lo maneje el servidor.
function responderErrorDeBaseDeDatos(res, error) {
  if (error.code === errorPostgresDuplicado) {
    responderError(res, 409, "El trámite ya tiene una cita vigente; cancélala o reagéndala antes de reservar otra");
    return true;
  }
  if (error.code === errorPostgresReferencia && mensajesReferenciaInexistente[error.constraint]) {
    responderError(res, 400, mensajesReferenciaInexistente[error.constraint]);
    return true;
  }
  return false;
}

// Atiende PUT y PATCH, que solo se diferencian en si se exigen todos los campos o no
async function editarCita(req, res, { esParcial }) {
  const idCita = leerIdDeLaUrl(req);
  if (!idCita) return responderError(res, 400, "El id debe ser un número entero positivo");

  const camposNuevos = req.body ?? {};
  if (esParcial && Object.keys(camposNuevos).length === 0) {
    return responderError(res, 400, "Envía al menos un campo para actualizar");
  }
  const errores = validarDatosEdicion(camposNuevos, { esParcial });
  if (errores.length > 0) return responderError(res, 400, "Datos de la cita inválidos", errores);

  try {
    const resultado = await citaService.actualizarCita(idCita, camposNuevos);
    responderResultado(res, resultado, 200);
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// ---------------------------------------------------------------------
// Funciones que atienden cada ruta
// ---------------------------------------------------------------------

// GET /api/citas
// Devuelve la lista de citas. Se puede filtrar por fecha del bloque, RUT del ciudadano, bloque y si están vigentes
// (ejemplo: ?fecha=2026-10-19&vigente=true). Responde 400 si los filtros no son válidos.
export async function listarCitas(req, res) {
  const { fecha, rut_ciudadano, vigente } = req.query;
  const idBloqueHorario = leerIdDeLaConsulta(req.query.id_bloque_horario);

  if (fecha && !esFechaValida(fecha)) {
    return responderError(res, 400, "La fecha debe ser válida y tener el formato AAAA-MM-DD");
  }
  if (rut_ciudadano && !esRutValido(rut_ciudadano)) {
    return responderError(res, 400, "El filtro rut_ciudadano debe tener formato 12345678-9");
  }
  if (Number.isNaN(idBloqueHorario)) {
    return responderError(res, 400, "El filtro id_bloque_horario debe ser un número entero positivo");
  }
  if (vigente && vigente !== "true" && vigente !== "false") {
    return responderError(res, 400, "El filtro vigente debe ser true o false");
  }

  const citas = await citaService.buscarCitas({
    fecha: fecha || null,
    rut_ciudadano: rut_ciudadano || null,
    id_bloque_horario: idBloqueHorario,
    vigente: vigente ? vigente === "true" : null,
  });
  res.status(200).json({ datos: citas });
}

// GET /api/citas/:id
// Devuelve una cita según su id. Responde 404 si no existe.
export async function obtenerCita(req, res) {
  const idCita = leerIdDeLaUrl(req);
  if (!idCita) return responderError(res, 400, "El id debe ser un número entero positivo");

  const cita = await citaService.buscarCitaPorId(idCita);
  if (!cita) return responderError(res, 404, "Cita no encontrada");

  res.status(200).json({ datos: cita });
}

// POST /api/citas
// Reserva una cita para un trámite en un bloque horario. Responde 201 con la cita creada; 400 si los datos no son válidos;
// o 409 si el bloque no está activo, ya pasó, no tiene cupos o el trámite ya tiene una cita vigente.
export async function crearCita(req, res) {
  const datosCita = req.body ?? {};
  const errores = validarDatosCreacion(datosCita);
  if (errores.length > 0) return responderError(res, 400, "Datos de la cita inválidos", errores);

  try {
    const resultado = await citaService.reservarCita(datosCita);
    responderResultado(res, resultado, 201);
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// PUT /api/citas/:id
// Reemplaza el bloque, el método de notificación y si está vigente (los tres son obligatorios).
// Responde con la cita actualizada, 404 si no existe, o 409 si el bloque nuevo no sirve.
export async function reemplazarCita(req, res) {
  return editarCita(req, res, { esParcial: false });
}

// PATCH /api/citas/:id
// Cambia solo los datos enviados de una cita: reagendar con { "id_bloque_horario": 2 } o cancelar con { "vigente": false }.
// Responde con la cita actualizada, 404 si no existe, o 409 si el bloque nuevo no sirve.
export async function actualizarCita(req, res) {
  return editarCita(req, res, { esParcial: true });
}

// DELETE /api/citas/:id
// Elimina una cita y libera su cupo. Responde 200 con un mensaje y la cita borrada, o 404 si no existe.
export async function eliminarCita(req, res) {
  const idCita = leerIdDeLaUrl(req);
  if (!idCita) return responderError(res, 400, "El id debe ser un número entero positivo");

  const citaEliminada = await citaService.borrarCita(idCita);
  if (!citaEliminada) return responderError(res, 404, "Cita no encontrada");

  res.status(200).json({ mensaje: "Cita eliminada", datos: citaEliminada });
}
