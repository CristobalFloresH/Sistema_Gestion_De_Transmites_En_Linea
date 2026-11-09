import { Router } from "express";
import * as catalogoController from "../controllers/catalogoController.js";

// Define qué función atiende cada catálogo. Se monta en /api, así que cada ruta queda como /api/<catálogo>.
// Los catálogos solo se leen: sus datos vienen cargados en licencias.sql.
const router = Router();

// Tipos de trámite, con los documentos que pide cada uno
router.get("/tipos_tramite", catalogoController.listarTiposTramite);
// Tipos de documento
router.get("/tipos_documento", catalogoController.listarTiposDocumento);
// Estados de un trámite
router.get("/estados_tramite", catalogoController.listarEstadosTramite);
// Estados de un documento
router.get("/estados_documento", catalogoController.listarEstadosDocumento);
// Métodos de notificación
router.get("/metodos_notificacion", catalogoController.listarMetodosNotificacion);
// Roles de usuario
router.get("/roles", catalogoController.listarRoles);

export default router;
