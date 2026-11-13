import { pool } from "../config/db.js";
import { enviarPlantilla, whatsappActivo } from "./whatsappService.js";
import { enviarCorreo, correoActivo } from "./correoService.js";
import { generarComprobante } from "../utils/comprobante.js";
import * as tramiteService from "../services/tramiteService.js";
import * as usuarioService from "../services/usuarioService.js";

const PLANTILLA = process.env.WHATSAPP_PLANTILLA_CONFIRMACION || "confirmacion_cita";
const IDIOMA = process.env.WHATSAPP_PLANTILLA_IDIOMA || "es";
const PLANTILLA_LISTA = process.env.WHATSAPP_PLANTILLA_LISTA || "licencia_lista";
const PLANTILLA_RECORDATORIO = process.env.WHATSAPP_PLANTILLA_RECORDATORIO || "recordatorio_cita";

// Convierte "2026-11-12" en "12-11-2026"
const formatearFecha = (fecha) => fecha.split("-").reverse().join("-");

// Deja solo los dígitos: "+56 9 1111 1111" -> "56911111111", que es el formato que pide WhatsApp
const soloDigitos = (telefono) => telefono.replace(/\D/g, "");

// Manda un aviso por correo al ciudadano de un trámite, con el comprobante adjunto cuando el aviso es de una cita.
// Nunca lanza errores: si el correo falla, la operación que lo disparó sigue siendo válida.
async function avisarPorCorreo({ idTramite, cita, asunto, texto }) {
  try {
    if (!correoActivo) {
      console.warn("Correo desactivado: faltan CORREO_USUARIO o CORREO_CLAVE en el .env");
      return;
    }

    const tramite = await tramiteService.buscarTramitePorId(idTramite);
    const usuario = tramite && (await usuarioService.buscarUsuarioPorRut(tramite.rut_ciudadano));
    if (!usuario?.correo) {
      console.warn(`Trámite ${idTramite}: el ciudadano no tiene correo registrado, no se envió el aviso`);
      return;
    }

    // El comprobante es el mismo PDF que se descarga desde la aplicación
    const adjunto = cita
      ? {
          filename: `comprobante-cita-${cita.id_cita}.pdf`,
          content: await generarComprobante({ ...cita, ...tramite }),
        }
      : undefined;

    await enviarCorreo({ para: usuario.correo, asunto, texto: texto(tramite), adjunto });
    console.log(`Correo enviado a ${usuario.correo} (trámite ${idTramite})`);
  } catch (error) {
    console.error(`No se pudo enviar el correo del trámite ${idTramite}:`, error.message);
  }
}

// Avisa por WhatsApp que la cita quedó reservada. Nunca lanza errores: si falla, la reserva sigue válida
export async function avisarCitaReservada(cita) {
  try {
    // El canal lo eligió el ciudadano al agendar (agregado por bushi al implementar el correo)
    if (cita.nombre_metodo_notificacion === "Correo") {
      return avisarPorCorreo({
        idTramite: cita.id_tramite,
        cita,
        asunto: "Comprobante de tu cita",
        texto: (tramite) => [
          `Hola ${tramite.nombre_ciudadano}:`,
          "",
          `Tu cita para el trámite de ${tramite.nombre_tipo_tramite} quedó reservada para el ${formatearFecha(cita.fecha)} a las ${cita.hora_inicio.slice(0, 5)}.`,
          "",
          "Adjuntamos el comprobante en PDF. Preséntate 15 minutos antes con tu cédula de identidad.",
          "",
          "Municipalidad de Santo Domingo",
        ].join("\n"),
      });
    }
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
// Avisa por WhatsApp que la licencia quedó lista para retiro. Misma idea que avisarCitaReservada:
// nunca lanza errores, para que un problema con Meta no afecte al trámite.
// (Escrito por bushi copiando la función de arriba; la plantilla todavía hay que crearla en Meta.)
export async function avisarLicenciaLista(idTramite) {
  try {
    // Teléfono del ciudadano, tipo de trámite y canal que eligió al agendar su última cita
    const { rows } = await pool.query(
      `select u.nombre, u.telefono, tt.nombre_tipo_tramite, m.nombre_metodo_notificacion
       from tramite t
       join usuario u on u.rut = t.rut_ciudadano
       join tipo_tramite tt on tt.id_tipo_tramite = t.id_tipo_tramite
       left join lateral (
         select c.id_metodo_notificacion
         from cita c
         where c.id_tramite = t.id_tramite
         order by c.fecha_reserva desc, c.id_cita desc
         limit 1
       ) ultima on true
       left join metodo_notificacion m on m.id_metodo_notificacion = ultima.id_metodo_notificacion
       where t.id_tramite = $1`,
      [idTramite],
    );
    const { nombre, telefono, nombre_tipo_tramite, nombre_metodo_notificacion } = rows[0] ?? {};
    if (nombre_metodo_notificacion === "Correo") {
      return avisarPorCorreo({
        idTramite,
        asunto: "Tu licencia está lista para retiro",
        texto: (tramite) => [
          `Hola ${tramite.nombre_ciudadano}:`,
          "",
          `Tu trámite de ${tramite.nombre_tipo_tramite} (N° ${tramite.id_tramite}) terminó y tu licencia está lista para retiro.`,
          "",
          "Retírala en la Municipalidad de Santo Domingo con tu cédula de identidad.",
          "",
          "Municipalidad de Santo Domingo",
        ].join("\n"),
      });
    }
    if (nombre_metodo_notificacion !== "WhatsApp") return;
    if (!whatsappActivo) {
      console.warn("WhatsApp desactivado: faltan WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID en el .env");
      return;
    }
    if (!telefono) {
      console.warn(`Trámite ${idTramite}: el ciudadano no tiene teléfono registrado, no se envió WhatsApp`);
      return;
    }

    await enviarPlantilla({
      telefono: soloDigitos(telefono),
      plantilla: PLANTILLA_LISTA,
      idioma: IDIOMA,
      variables: [nombre, nombre_tipo_tramite],
    });
    console.log(`WhatsApp de licencia lista enviado (trámite ${idTramite})`);
  } catch (error) {
    console.error(`No se pudo enviar el WhatsApp del trámite ${idTramite}:`, error.message);
  }
}

// Recuerda al ciudadano la cita que tiene al día siguiente (RF-11). Lo llama el script
// scripts/recordatorios.js, que se ejecuta una vez al día. Nunca lanza errores.
export async function avisarRecordatorioCita(cita) {
  try {
    if (cita.nombre_metodo_notificacion === "Correo") {
      return avisarPorCorreo({
        idTramite: cita.id_tramite,
        cita,
        asunto: "Recordatorio: mañana tienes tu cita",
        texto: (tramite) => [
          `Hola ${tramite.nombre_ciudadano}:`,
          "",
          `Te recordamos que mañana ${formatearFecha(cita.fecha)} a las ${cita.hora_inicio.slice(0, 5)} tienes tu cita para el trámite de ${tramite.nombre_tipo_tramite}.`,
          "",
          "Preséntate 15 minutos antes con tu cédula de identidad. Adjuntamos otra vez el comprobante.",
          "",
          "Municipalidad de Santo Domingo",
        ].join("\n"),
      });
    }
    if (cita.nombre_metodo_notificacion !== "WhatsApp") return;
    if (!whatsappActivo) {
      console.warn("WhatsApp desactivado: faltan WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID en el .env");
      return;
    }

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
      console.warn(`Cita ${cita.id_cita}: el ciudadano no tiene teléfono registrado, no se envió el recordatorio`);
      return;
    }

    await enviarPlantilla({
      telefono: soloDigitos(telefono),
      plantilla: PLANTILLA_RECORDATORIO,
      idioma: IDIOMA,
      variables: [nombre_tipo_tramite, formatearFecha(cita.fecha), cita.hora_inicio.slice(0, 5)],
    });
    console.log(`WhatsApp de recordatorio enviado (cita ${cita.id_cita})`);
  } catch (error) {
    console.error(`No se pudo enviar el recordatorio de la cita ${cita.id_cita}:`, error.message);
  }
}
