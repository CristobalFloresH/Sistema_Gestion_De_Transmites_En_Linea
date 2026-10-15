import { Router } from "express";
import * as tramiteController from "../controllers/tramiteController.js";

// Define qué función atiende cada petición a /api/tramites, según el método HTTP y la URL.
const router = Router();

// Lista todos los trámites (se puede filtrar por ciudadano, tipo o estado)
router.get("/", tramiteController.listarTramites);
// Muestra un trámite según su id, con su historial de estados
router.get("/:id", tramiteController.obtenerTramite);
// Crea un trámite nuevo para un ciudadano
router.post("/", tramiteController.crearTramite);
// Reemplaza el tipo y el estado de un trámite
router.put("/:id", tramiteController.reemplazarTramite);
// Cambia solo algunos datos de un trámite (por ejemplo, su estado)
router.patch("/:id", tramiteController.actualizarTramite);
// Elimina un trámite que aún no tiene citas ni documentos
router.delete("/:id", tramiteController.eliminarTramite);

export default router;
