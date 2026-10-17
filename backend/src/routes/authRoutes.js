import { Router } from "express";
import * as authController from "../controllers/authController.js";

//Se instancia el enrutador
const router = Router();

// Rutas públicas

//El frontend envaira aqui los datos para crear la cuenta
router.post("/registro", authController.registrar);
//El frontend enviara aqui los datos para validarlos
router.post("/login", authController.login);

export default router;