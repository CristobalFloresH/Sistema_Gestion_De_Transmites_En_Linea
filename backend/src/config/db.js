import pg from "pg";

const { Pool } = pg;

pg.types.setTypeParser(1082, (valor) => valor); // las fechas (date) llegan como texto "AAAA-MM-DD", sin correrse por la zona horaria

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
