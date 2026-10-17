import { Router } from "express";
import * as citaController from "../controllers/citaController.js";
import {
  verificarToken,
  autorizarRoles,
  limitarListadoAlCiudadano,
} from "../middlewares/authMiddleware.js";

const router = Router();
//Exige token valido para las acciones de las citas
router.use(verificarToken);
router.get("/", limitarListadoAlCiudadano, citaController.listarCitas);
//Cualquier usuario logueado puede ver una cita específica, crearla o editarla.
router.get("/:id", citaController.obtenerCita);
router.post("/", citaController.crearCita);
router.put("/:id", citaController.reemplazarCita);
router.patch("/:id", citaController.actualizarCita);
//Solo admins o funcionarios pueden cancelar/eliminar citas
router.delete("/:id", autorizarRoles("funcionario", "administrador"), citaController.eliminarCita);

export default router;