import { pool } from "../config/db.js";
import { enviarPlantilla, whatsappActivo } from "./whatsappService.js";

const PLANTILLA = process.env.WHATSAPP_PLANTILLA_CONFIRMACION || "confirmacion_cita";
const IDIOMA = process.env.WHATSAPP_PLANTILLA_IDIOMA || "es";

// Convierte "2026-11-12" en "12-11-2026"
const formatearFecha = (fecha) => fecha.split("-").reverse().join("-");

// Deja solo los dígitos: "+56 9 1111 1111" -> "56911111111", que es el formato que pide WhatsApp
const soloDigitos = (telefono) => telefono.replace(/\D/g, "");

// Avisa por WhatsApp que la cita quedó reservada. Nunca lanza errores: si falla, la reserva sigue válida
export async function avisarCitaReservada(cita) {
  try {
    if (cita.nombre_metodo_notificacion !== "WhatsApp") return;
    if (!whatsappActivo) {
      console.warn("WhatsApp desactivado: faltan WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID en el .env");
      return;
    }

    // Teléfono del ciudadano y nombre del trámite, para armar el mensaje
    const { rows } = await pool.query(
      `select u.telefono, tt.nombre_tipo_tramite
       from tramite t
       join usuario u on u.rut = t.rut_ciudadano
       join tipo_tramite tt on tt.id_tipo_tramite = t.id_tipo_tramite
       where t.id_tramite = $1`,
      [cita.id_tramite],
    );
    const { telefono, nombre_tipo_tramite } = rows[0] ?? {};
    if (!telefono) {
      console.warn(`Cita ${cita.id_cita}: el ciudadano no tiene teléfono registrado, no se envió WhatsApp`);
      return;
    }

    await enviarPlantilla({
      telefono: soloDigitos(telefono),
      plantilla: PLANTILLA,
      idioma: IDIOMA,
      variables: [nombre_tipo_tramite, formatearFecha(cita.fecha), cita.hora_inicio.slice(0, 5)],
    });
    console.log(`WhatsApp de confirmación enviado (cita ${cita.id_cita})`);
  } catch (error) {
    console.error(`No se pudo enviar el WhatsApp de la cita ${cita.id_cita}:`, error.message);
  }
}