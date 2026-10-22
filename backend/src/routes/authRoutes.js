import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { verificarToken, autorizarRoles } from "../middlewares/authMiddleware.js";

//Se instancia el enrutador
const router = Router();

// Alta de usuarios: solo un administrador con sesión iniciada puede crear cuentas
router.post("/registro", verificarToken, autorizarRoles("administrador"), authController.registrar);

// Ruta pública: el frontend enviará aquí los datos para validarlos
router.post("/login", authController.login);

export default router;