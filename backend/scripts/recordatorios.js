// Envía el recordatorio de las citas que empiezan en 24 horas (RF-11), por el canal que eligió cada ciudadano.
// Se ejecuta una vez por hora: npm run recordatorios
// Cada cita entra en la ventana de 24 a 25 horas una sola vez, así que nadie recibe el aviso dos veces.
// Para que corra solo, se programa desde fuera (Programador de tareas de Windows, o cron en el contenedor).
//
// Con una fecha como argumento avisa a todas las citas vigentes de ese día, sin mirar la hora.
// Sirve para mostrarlo en vivo: npm run recordatorios -- 2026-11-16
import "dotenv/config";
import { pool } from "../src/config/db.js";
import { buscarCitas, buscarCitasEnVentana } from "../src/services/citaService.js";
import { avisarRecordatorioCita } from "../src/services/notificacionService.js";

const fecha = process.argv[2];
const citas = fecha
  ? await buscarCitas({ fecha, vigente: true })
  : await buscarCitasEnVentana(24, 25);

console.log(fecha
  ? `Citas vigentes del ${fecha}: ${citas.length}`
  : `Citas que empiezan en 24 horas: ${citas.length}`);

// Los avisos no lanzan errores: si uno falla, los demás se envían igual
for (const cita of citas) await avisarRecordatorioCita(cita);

console.log("Recordatorios terminados");
await pool.end();
