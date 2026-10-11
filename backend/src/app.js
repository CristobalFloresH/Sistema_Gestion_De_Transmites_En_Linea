import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middlewares/request-logger.js';
import { pool } from './config/db.js';

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando' });
});

pool.query('select now()')
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch((err) => console.error('Error al conectar a PostgreSQL:', err.message));


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
