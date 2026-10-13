import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middlewares/request-logger.js";
import { pool } from "./config/db.js";
import bloqueHorarioRoutes from "./routes/bloqueHorarioRoutes.js"; // rutas de los bloques horarios

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

app.use("/api/bloques_horarios", bloqueHorarioRoutes); // todas las peticiones a /api/bloques_horarios las atienden estas rutas

app.use((req, res) => {
  res.status(404).json({
    error: {
      estado: 404,
      mensaje: `No existe la ruta ${req.method} ${req.originalUrl}`,
    },
  });
}); // responde 404 cuando se pide una ruta que no existe

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ error: { estado: 400, mensaje: "El cuerpo de la petición no es un JSON válido" } });
  } // responde 400 cuando el cuerpo de la petición trae un JSON mal escrito
  console.error(err);
  res
    .status(500)
    .json({ error: { estado: 500, mensaje: "Error interno del servidor" } });
}); // responde 500 ante cualquier error inesperado, sin mostrar detalles internos

pool
  .query("select now()")
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) =>
    console.error("Error al conectar a PostgreSQL:", err.message),
  );

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
