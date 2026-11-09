import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import {
  verificarToken,
  autorizarRoles,
  autorizarPropioORoles,
} from "../middlewares/authMiddleware.js";

const router = Router();

//se exige token
router.use(verificarToken);

//Ver listado de todos los usuarios (restringido por rol)
router.get("/", autorizarRoles("funcionario", "administrador"), usuarioController.listarUsuarios);
router.get("/:rut", autorizarPropioORoles("funcionario", "administrador"), usuarioController.obtenerUsuario);
router.put("/:rut", autorizarRoles("administrador"), usuarioController.reemplazarUsuario);
router.patch("/:rut", autorizarRoles("administrador"), usuarioController.actualizarUsuario);
router.delete("/:rut", autorizarRoles("administrador"), usuarioController.eliminarUsuario);

export default router;