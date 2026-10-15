import { Router } from "express";
import * as documentoController from "../controllers/documentoController.js";

// Define qué función atiende cada petición a /api/documentos, según el método HTTP y la URL.
const router = Router();

// Lista todos los documentos (se puede filtrar por trámite o por estado)
router.get("/", documentoController.listarDocumentos);
// Muestra un documento según su id
router.get("/:id", documentoController.obtenerDocumento);
// Registra un documento PDF de un trámite
router.post("/", documentoController.crearDocumento);
// Reemplaza el archivo, el estado y la revisión de un documento
router.put("/:id", documentoController.reemplazarDocumento);
// Cambia solo algunos datos de un documento (por ejemplo, aprobarlo o rechazarlo)
router.patch("/:id", documentoController.actualizarDocumento);
// Elimina un documento que aún no ha sido revisado
router.delete("/:id", documentoController.eliminarDocumento);

export default router;
