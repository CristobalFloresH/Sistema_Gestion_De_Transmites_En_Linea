import { Router } from "express";
import multer from "multer";
import * as documentoController from "../controllers/documentoController.js";
import { responderError } from "../utils/apoyoControladores.js";
import {
  verificarToken,
  autorizarRoles,
  ciudadanoSoloSuTramiteEnElCuerpo,
  ciudadanoSoloSusDocumentos,
  ciudadanoSoloDocumentosDeSusTramites,
} from "../middlewares/authMiddleware.js";

const router = Router();

// El PDF llega en memoria y solo se escribe en disco cuando pasó todas las validaciones del controlador
const subirPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 MB, un archivo por petición
});

// Si el archivo no se pudo recibir (pesa de más, viene en otro campo), se responde con un mensaje claro
function responderErrorDeSubida(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    const mensaje =
      error.code === "LIMIT_FILE_SIZE"
        ? "El archivo supera el máximo de 5 MB"
        : "Envía un solo archivo PDF en el campo archivo";
    return responderError(res, 400, mensaje);
  }
  next(error);
}

// En multipart todos los campos llegan como texto; el controlador espera los id como números
function convertirIdsANumero(req, res, next) {
  for (const campo of ["id_tramite", "id_tipo_documento"]) {
    if (req.body?.[campo] !== undefined) req.body[campo] = Number(req.body[campo]);
  }
  next();
}

//Se exige la toquen para interactuar con los documentos
router.use(verificarToken);
//Los logueados pueden ver y subir documentos (un ciudadano solo los de sus trámites)
router.get("/", ciudadanoSoloDocumentosDeSusTramites, documentoController.listarDocumentos);
router.get("/:id", ciudadanoSoloSusDocumentos, documentoController.obtenerDocumento);
//El archivo se recibe y los id se convierten antes de revisar que el trámite sea del ciudadano
router.post(
  "/",
  subirPdf.single("archivo"),
  responderErrorDeSubida,
  convertirIdsANumero,
  ciudadanoSoloSuTramiteEnElCuerpo,
  documentoController.crearDocumento,
);
//Solo el personal auutorizado puede alterar la informacion de los documentos
router.put("/:id", autorizarRoles("funcionario", "administrador"), documentoController.reemplazarDocumento);
router.patch("/:id", autorizarRoles("funcionario", "administrador"), documentoController.actualizarDocumento);
//Un ciudadano solo puede eliminar documentos de sus propios trámites
router.delete("/:id", ciudadanoSoloSusDocumentos, documentoController.eliminarDocumento);

export default router;
