// Habla con la API de WhatsApp Cloud (Meta). Es el único archivo que conoce esa API.

const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const ID_NUMERO = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERSION_API = process.env.WHATSAPP_API_VERSION || "v21.0";

// Sin credenciales el envío queda desactivado, así el resto del equipo puede correr el backend sin WhatsApp
export const whatsappActivo = Boolean(TOKEN && ID_NUMERO);

// Envía un mensaje de plantilla aprobada. variables = textos que reemplazan {{1}}, {{2}}, ... en el mismo orden
export async function enviarPlantilla({ telefono, plantilla, idioma, variables }) {
  const respuesta = await fetch(`https://graph.facebook.com/${VERSION_API}/${ID_NUMERO}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: telefono,
      type: "template",
      template: {
        name: plantilla,
        language: { code: idioma },
        components: [
          { type: "body", parameters: variables.map((texto) => ({ type: "text", text: texto })) },
        ],
      },
    }),
    signal: AbortSignal.timeout(10000), // si Meta no responde en 10 segundos, se cancela
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.json().catch(() => ({}));
    throw new Error(`WhatsApp respondió ${respuesta.status}: ${detalle.error?.message ?? "sin detalle"}`);
  }
}