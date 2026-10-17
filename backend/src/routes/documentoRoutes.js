import { Router } from "express";
import * as documentoController from "../controllers/documentoController.js";
import { verificarToken, autorizarRoles } from "../middlewares/authMiddleware.js";

const router = Router();

//Se exige la toquen para interactuar con los documentos
router.use(verificarToken);
//Los logueados pueden ver los documentos
router.get("/", documentoController.listarDocumentos);
router.get("/:id", documentoController.obtenerDocumento);
router.post("/", documentoController.crearDocumento);
//Solo el personal auutorizado puede alterar la informacion de los documentos
router.put("/:id", autorizarRoles("funcionario", "administrador"), documentoController.reemplazarDocumento);
router.patch("/:id", autorizarRoles("funcionario", "administrador"), documentoController.actualizarDocumento);
router.delete("/:id", documentoController.eliminarDocumento);

export default router;