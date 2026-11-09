import { Router } from "express";
import * as bloqueHorarioController from "../controllers/bloqueHorarioController.js";
import { verificarToken, autorizarRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verificarToken);

//Cualquier logueado puede ver los horarios 
router.get("/", bloqueHorarioController.listarBloquesHorarios);
router.get("/:id", bloqueHorarioController.obtenerBloqueHorario);
//Solo deja pasar a funcionarios y administradores
const soloPersonal = autorizarRoles("funcionario", "administrador");
//Rutas de escritura en donde solo el personal autorizado podra modificar
router.post("/", soloPersonal, bloqueHorarioController.crearBloqueHorario);
router.put("/:id", soloPersonal, bloqueHorarioController.reemplazarBloqueHorario);
router.patch("/:id", soloPersonal, bloqueHorarioController.actualizarBloqueHorario);
router.delete("/:id", soloPersonal, bloqueHorarioController.eliminarBloqueHorario);

export default router;