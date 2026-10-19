import { Router } from "express";
import * as documentoController from "../controllers/documentoController.js";
import {
  verificarToken,
  autorizarRoles,
  ciudadanoSoloSuTramiteEnElCuerpo,
  ciudadanoSoloSusDocumentos,
  ciudadanoSoloDocumentosDeSusTramites,
} from "../middlewares/authMiddleware.js";

const router = Router();

//Se exige la toquen para interactuar con los documentos
router.use(verificarToken);
//Los logueados pueden ver y subir documentos (un ciudadano solo los de sus trámites)
router.get("/", ciudadanoSoloDocumentosDeSusTramites, documentoController.listarDocumentos);
router.get("/:id", ciudadanoSoloSusDocumentos, documentoController.obtenerDocumento);
router.post("/", ciudadanoSoloSuTramiteEnElCuerpo, documentoController.crearDocumento);
//Solo el personal auutorizado puede alterar la informacion de los documentos
router.put("/:id", autorizarRoles("funcionario", "administrador"), documentoController.reemplazarDocumento);
router.patch("/:id", autorizarRoles("funcionario", "administrador"), documentoController.actualizarDocumento);
//Un ciudadano solo puede eliminar documentos de sus propios trámites
router.delete("/:id", ciudadanoSoloSusDocumentos, documentoController.eliminarDocumento);

export default router;