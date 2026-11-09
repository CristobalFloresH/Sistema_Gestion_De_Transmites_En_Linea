import * as bloqueHorarioService from "../services/bloqueHorarioService.js";

// Este archivo recibe las peticiones de bloques horarios: revisa que los datos sean correctos,
// le pide al servicio que haga el trabajo en la base de datos y decide qué responderle al cliente.

// Códigos que usa PostgreSQL para avisar ciertos errores, para poder responder con un mensaje claro
const errorPostgresDuplicado = "23505"; // ya existe un bloque con esa misma fecha y hora de inicio
const errorPostgresCheck = "23514"; // los datos no cumplen una regla de la tabla (por ejemplo, la hora de término es antes que la de inicio)

// Campos que se aceptan al crear o editar un bloque, y cuáles son obligatorios al crearlo
const camposPermitidos = bloqueHorarioService.columnasEditables;
const camposObligatorios = ["fecha", "hora_inicio", "hora_fin", "cupos"];

// ---------------------------------------------------------------------
// Funciones de apoyo
// ---------------------------------------------------------------------

// Envía una respuesta de error con un formato uniforme: el código, un mensaje y, si hay, el detalle
function responderError(res, estado, mensaje, detalles) {
  const error = { estado, mensaje };
  if (detalles) error.detalles = detalles;
  return res.status(estado).json({ error });
}

// Revisa que el texto sea una fecha real escrita como AAAA-MM-DD (por ejemplo, rechaza el 30 de febrero)
function esFechaValida(texto) {
  if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const fecha = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().startsWith(texto);
}

// Revisa que el texto sea una hora válida escrita como HH:MM
function esHoraValida(texto) {
  return typeof texto === "string" && /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(texto);
}

// Toma el id que viene en la URL y lo devuelve como número; si no es un número válido, devuelve null
function leerIdBloqueHorario(req) {
  const idBloqueHorario = Number(req.params.id);
  return Number.isInteger(idBloqueHorario) && idBloqueHorario > 0 ? idBloqueHorario : null;
}

// Revisa los datos enviados para un bloque y devuelve la lista de problemas encontrados (vacía si todo está bien).
// Al editar solo algunos campos (PATCH) no se exige que vengan todos.
function validarDatosBloqueHorario(datosBloqueHorario, { esParcial }) {
  const errores = [];

  const camposDesconocidos = Object.keys(datosBloqueHorario).filter(
    (nombreCampo) => !camposPermitidos.includes(nombreCampo),
  );
  if (camposDesconocidos.length > 0) {
    errores.push(`Campos no permitidos: ${camposDesconocidos.join(", ")}`);
  }

  if (!esParcial) {
    for (const nombreCampo of camposObligatorios) {
      if (datosBloqueHorario[nombreCampo] === undefined) errores.push(`Falta el campo ${nombreCampo}`);
    }
  }

  const { fecha, hora_inicio, hora_fin, cupos, activo } = datosBloqueHorario;
  if (fecha !== undefined && !esFechaValida(fecha)) {
    errores.push("fecha debe ser una fecha válida con formato AAAA-MM-DD");
  }
  if (hora_inicio !== undefined && !esHoraValida(hora_inicio)) {
    errores.push("hora_inicio debe tener formato HH:MM");
  }
  if (hora_fin !== undefined && !esHoraValida(hora_fin)) {
    errores.push("hora_fin debe tener formato HH:MM");
  }
  if (esHoraValida(hora_inicio) && esHoraValida(hora_fin) && hora_fin <= hora_inicio) {
    errores.push("hora_fin debe ser posterior a hora_inicio");
  }
  if (cupos !== undefined && (!Number.isInteger(cupos) || cupos <= 0)) {
    errores.push("cupos debe ser un número entero mayor que 0");
  }
  if (activo !== undefined && typeof activo !== "boolean") {
    errores.push("activo debe ser true o false");
  }

  return errores;
}

// Si la base de datos rechazó la operación por un motivo conocido, responde al cliente con un mensaje claro.
// Devuelve false cuando es un error inesperado, para que lo maneje el servidor.
function responderErrorDeBaseDeDatos(res, error) {
  if (error.code === errorPostgresDuplicado) {
    responderError(res, 409, "Ya existe un bloque que empieza a esa hora ese día");
    return true;
  }
  if (error.code === errorPostgresCheck) {
    responderError(res, 400, "Los datos no cumplen las reglas del bloque (hora_fin debe ser posterior a hora_inicio)");
    return true;
  }
  return false;
}

// Comprueba que los nuevos cupos alcancen para las citas que ya están reservadas en el bloque
async function cuposAlcanzanParaCitas(idBloqueHorario, cuposNuevos) {
  if (cuposNuevos === undefined) return true;
  const citasVigentes = await bloqueHorarioService.contarCitasDelBloqueHorario(idBloqueHorario, { soloVigentes: true });
  return cuposNuevos >= citasVigentes;
}

// ---------------------------------------------------------------------
// Funciones que atienden cada ruta
// ---------------------------------------------------------------------

// GET /api/bloques_horarios
// Devuelve la lista de bloques horarios con sus cupos disponibles. Se puede filtrar por fecha y por si están activos
// (ejemplo: ?fecha=2026-10-20&activo=true). Responde 400 si los filtros no son válidos.
export async function listarBloquesHorarios(req, res) {
  const { fecha, activo } = req.query;

  if (fecha && !esFechaValida(fecha)) {
    return responderError(res, 400, "La fecha debe ser válida y tener el formato AAAA-MM-DD");
  }
  if (activo && activo !== "true" && activo !== "false") {
    return responderError(res, 400, "El filtro activo debe ser true o false");
  }

  const bloquesHorarios = await bloqueHorarioService.buscarBloquesHorarios({
    fecha: fecha || null,
    activo: activo ? activo === "true" : null,
  });
  res.status(200).json({ datos: bloquesHorarios });
}

// GET /api/bloques_horarios/:id
// Devuelve un bloque horario según su id. Responde 404 si no existe.
export async function obtenerBloqueHorario(req, res) {
  const idBloqueHorario = leerIdBloqueHorario(req);
  if (!idBloqueHorario) return responderError(res, 400, "El id debe ser un número entero positivo");

  const bloqueHorario = await bloqueHorarioService.buscarBloqueHorarioPorId(idBloqueHorario);
  if (!bloqueHorario) return responderError(res, 404, "Bloque horario no encontrado");

  res.status(200).json({ datos: bloqueHorario });
}

// POST /api/bloques_horarios
// Crea un bloque horario nuevo con los datos enviados. Responde 201 con el bloque creado,
// o un error si los datos no son válidos o ya existe un bloque a esa hora ese día.
export async function crearBloqueHorario(req, res) {
  const datosBloqueHorario = req.body ?? {};
  const errores = validarDatosBloqueHorario(datosBloqueHorario, { esParcial: false });
  if (errores.length > 0) return responderError(res, 400, "Datos del bloque inválidos", errores);

  try {
    const bloqueHorarioCreado = await bloqueHorarioService.insertarBloqueHorario(datosBloqueHorario);
    res.status(201).location(`/api/bloques_horarios/${bloqueHorarioCreado.id_bloque_horario}`).json({ datos: bloqueHorarioCreado });
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// PUT /api/bloques_horarios/:id
// Reemplaza todos los datos de un bloque horario. Responde con el bloque actualizado, 404 si no existe,
// o 409 si los cupos nuevos no alcanzan para las citas ya reservadas.
export async function reemplazarBloqueHorario(req, res) {
  const idBloqueHorario = leerIdBloqueHorario(req);
  if (!idBloqueHorario) return responderError(res, 400, "El id debe ser un número entero positivo");

  const datosBloqueHorario = req.body ?? {};
  const errores = validarDatosBloqueHorario(datosBloqueHorario, { esParcial: false });
  if (errores.length > 0) return responderError(res, 400, "Datos del bloque inválidos", errores);

  if (!(await cuposAlcanzanParaCitas(idBloqueHorario, datosBloqueHorario.cupos))) {
    return responderError(res, 409, "Los cupos no pueden ser menos que las citas vigentes del bloque");
  }

  try {
    const bloqueHorarioActualizado = await bloqueHorarioService.reemplazarBloqueHorario(idBloqueHorario, datosBloqueHorario);
    if (!bloqueHorarioActualizado) return responderError(res, 404, "Bloque horario no encontrado");
    res.status(200).json({ datos: bloqueHorarioActualizado });
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// PATCH /api/bloques_horarios/:id
// Cambia solo los datos enviados de un bloque horario (por ejemplo, para desactivarlo).
// Responde con el bloque actualizado, 404 si no existe, o 409 si los cupos no alcanzan para las citas reservadas.
export async function actualizarBloqueHorario(req, res) {
  const idBloqueHorario = leerIdBloqueHorario(req);
  if (!idBloqueHorario) return responderError(res, 400, "El id debe ser un número entero positivo");

  const camposNuevos = req.body ?? {};
  if (Object.keys(camposNuevos).length === 0) {
    return responderError(res, 400, "Envía al menos un campo para actualizar");
  }
  const errores = validarDatosBloqueHorario(camposNuevos, { esParcial: true });
  if (errores.length > 0) return responderError(res, 400, "Datos del bloque inválidos", errores);

  if (!(await cuposAlcanzanParaCitas(idBloqueHorario, camposNuevos.cupos))) {
    return responderError(res, 409, "Los cupos no pueden ser menos que las citas vigentes del bloque");
  }

  try {
    const bloqueHorarioActualizado = await bloqueHorarioService.actualizarCamposBloqueHorario(idBloqueHorario, camposNuevos);
    if (!bloqueHorarioActualizado) return responderError(res, 404, "Bloque horario no encontrado");
    res.status(200).json({ datos: bloqueHorarioActualizado });
  } catch (error) {
    if (!responderErrorDeBaseDeDatos(res, error)) throw error;
  }
}

// DELETE /api/bloques_horarios/:id
// Elimina un bloque horario que nunca haya tenido citas. Responde 200 con un mensaje y el bloque borrado, 404 si no existe,
// o 409 si tiene citas (en ese caso conviene desactivarlo).
export async function eliminarBloqueHorario(req, res) {
  const idBloqueHorario = leerIdBloqueHorario(req);
  if (!idBloqueHorario) return responderError(res, 400, "El id debe ser un número entero positivo");

  // Si el bloque tuvo citas (aunque estén canceladas) no se borra, para no perder el historial; se puede desactivar en su lugar
  const citasDelBloqueHorario = await bloqueHorarioService.contarCitasDelBloqueHorario(idBloqueHorario, { soloVigentes: false });
  if (citasDelBloqueHorario > 0) {
    return responderError(
      res,
      409,
      "El bloque tiene citas asociadas y no se puede eliminar; desactívalo con PATCH { \"activo\": false }",
    );
  }

  const bloqueHorarioEliminado = await bloqueHorarioService.borrarBloqueHorario(idBloqueHorario);
  if (!bloqueHorarioEliminado) return responderError(res, 404, "Bloque horario no encontrado");

  res.status(200).json({ mensaje: "Bloque horario eliminado", datos: bloqueHorarioEliminado });
}
