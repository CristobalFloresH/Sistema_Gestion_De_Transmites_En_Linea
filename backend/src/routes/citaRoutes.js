import { Router } from "express";
import * as citaController from "../controllers/citaController.js";

// Define qué función atiende cada petición a /api/citas, según el método HTTP y la URL.
const router = Router();

// Lista todas las citas (se puede filtrar por fecha, ciudadano, bloque o si están vigentes)
router.get("/", citaController.listarCitas);
// Muestra una cita según su id
router.get("/:id", citaController.obtenerCita);
// Reserva una cita nueva en un bloque horario
router.post("/", citaController.crearCita);
// Reemplaza el bloque, el método de notificación y la vigencia de una cita
router.put("/:id", citaController.reemplazarCita);
// Cambia solo algunos datos de una cita (reagendar o cancelar)
router.patch("/:id", citaController.actualizarCita);
// Elimina una cita
router.delete("/:id", citaController.eliminarCita);

export default router;
