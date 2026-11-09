import { Router } from "express";
import * as citaController from "../controllers/citaController.js";
import {
  verificarToken,
  autorizarRoles,
  limitarListadoAlCiudadano,
  ciudadanoSoloSusCitas,
  ciudadanoSoloSuTramiteEnElCuerpo,
} from "../middlewares/authMiddleware.js";

const router = Router();
//Exige token valido para las acciones de las citas
router.use(verificarToken);
router.get("/", limitarListadoAlCiudadano, citaController.listarCitas);
//Un ciudadano solo puede ver sus citas y reservar en sus propios trámites
router.get("/:id", ciudadanoSoloSusCitas, citaController.obtenerCita);
router.post("/", ciudadanoSoloSuTramiteEnElCuerpo, citaController.crearCita);
//Un ciudadano solo puede editar (cancelar o reagendar) sus propias citas
router.put("/:id", ciudadanoSoloSusCitas, citaController.reemplazarCita);
router.patch("/:id", ciudadanoSoloSusCitas, citaController.actualizarCita);
//Solo admins o funcionarios pueden cancelar/eliminar citas
router.delete("/:id", autorizarRoles("funcionario", "administrador"), citaController.eliminarCita);

export default router;