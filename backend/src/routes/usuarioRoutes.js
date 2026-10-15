import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";

// Define qué función atiende cada petición a /api/usuarios, según el método HTTP y la URL.
// No hay POST: los usuarios nuevos se crean con el registro.
const router = Router();

// Lista todos los usuarios (se puede filtrar por rol o por si están activos)
router.get("/", usuarioController.listarUsuarios);
// Muestra un usuario según su RUT
router.get("/:rut", usuarioController.obtenerUsuario);
// Reemplaza los datos de un usuario
router.put("/:rut", usuarioController.reemplazarUsuario);
// Cambia solo algunos datos de un usuario (por ejemplo, desactivarlo)
router.patch("/:rut", usuarioController.actualizarUsuario);
// Elimina un usuario sin trámites ni revisiones
router.delete("/:rut", usuarioController.eliminarUsuario);

export default router;
