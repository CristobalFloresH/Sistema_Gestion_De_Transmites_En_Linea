import nodemailer from "nodemailer";

// Habla con el servidor de correo (Gmail). Es el único archivo que conoce cómo se envía un correo.

const USUARIO = process.env.CORREO_USUARIO;
const CLAVE = process.env.CORREO_CLAVE; // contraseña de aplicación de Google, no la clave normal de la cuenta
const REMITENTE = process.env.CORREO_REMITENTE || "Municipalidad de Santo Domingo";

// Sin credenciales el envío queda desactivado, así el resto del equipo puede correr el backend sin configurar correo
export const correoActivo = Boolean(USUARIO && CLAVE);

const transporte = correoActivo
  ? nodemailer.createTransport({ service: "gmail", auth: { user: USUARIO, pass: CLAVE } })
  : null;

// Envía un correo de texto, con un archivo adjunto opcional ({ filename, content })
export async function enviarCorreo({ para, asunto, texto, adjunto }) {
  await transporte.sendMail({
    from: `${REMITENTE} <${USUARIO}>`,
    to: para,
    subject: asunto,
    text: texto,
    attachments: adjunto ? [adjunto] : [],
  });
}
