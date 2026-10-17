import { Router } from "express";
import * as tramiteController from "../controllers/tramiteController.js";
import {
  verificarToken,
  autorizarRoles,
  limitarListadoAlCiudadano,
  ciudadanoSoloSuRut,
} from "../middlewares/authMiddleware.js";

const router = Router();

//Se exige token valido
router.use(verificarToken);

//Lista trámites (un ciudadano solo ve los suyos)
router.get("/", limitarListadoAlCiudadano, tramiteController.listarTramites);
//Muestra un trámite según su id
router.get("/:id", tramiteController.obtenerTramite);
//Crea un trámite (un ciudadano solo puede crearlo a su nombre)
router.post("/", ciudadanoSoloSuRut, tramiteController.crearTramite);
//Modificar o eliminar: solo funcionario y administrador
router.put("/:id", autorizarRoles("funcionario", "administrador"), tramiteController.reemplazarTramite);
router.patch("/:id", autorizarRoles("funcionario", "administrador"), tramiteController.actualizarTramite);
router.delete("/:id", autorizarRoles("funcionario", "administrador"), tramiteController.eliminarTramite);

export default router;