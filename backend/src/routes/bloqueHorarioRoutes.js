import { Router } from "express";
import * as bloqueHorarioController from "../controllers/bloqueHorarioController.js";

// Define qué función atiende cada petición a /api/bloques_horarios, según el método HTTP y la URL.
const router = Router();

// Lista todos los bloques horarios (se puede filtrar por fecha o por si están activos)
router.get("/", bloqueHorarioController.listarBloquesHorarios);
// Muestra un bloque horario según su id
router.get("/:id", bloqueHorarioController.obtenerBloqueHorario);
// Crea un bloque horario nuevo
router.post("/", bloqueHorarioController.crearBloqueHorario);
// Reemplaza todos los datos de un bloque horario
router.put("/:id", bloqueHorarioController.reemplazarBloqueHorario);
// Cambia solo algunos datos de un bloque horario
router.patch("/:id", bloqueHorarioController.actualizarBloqueHorario);
// Elimina un bloque horario
router.delete("/:id", bloqueHorarioController.eliminarBloqueHorario);

export default router;
