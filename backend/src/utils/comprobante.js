import PDFDocument from "pdfkit";

// Arma el comprobante de una cita como PDF. Devuelve el archivo en memoria (Buffer) y no escribe
// ni responde nada: así el mismo comprobante sirve para la descarga y para adjuntarlo en un correo o un WhatsApp.

// Fecha AAAA-MM-DD y hora HH:MM:SS escritas como "10/11/2026 a las 09:00"
function escribirFechaHora(fecha, horaInicio) {
  const [anio, mes, dia] = String(fecha).slice(0, 10).split("-");
  return `${dia}/${mes}/${anio} a las ${String(horaInicio).slice(0, 5)}`;
}

// Recibe los datos de la cita junto con los de su trámite y devuelve una promesa con el PDF listo
export function generarComprobante(datos) {
  return new Promise((resolve, reject) => {
    const documento = new PDFDocument({ size: "A4", margin: 60 });
    const partes = [];
    documento.on("data", (parte) => partes.push(parte));
    documento.on("end", () => resolve(Buffer.concat(partes)));
    documento.on("error", reject);

    documento.fontSize(20).text("Municipalidad de Santo Domingo", { align: "center" });
    documento.fontSize(14).text("Comprobante de cita", { align: "center" });
    documento.moveDown(2);

    const lineas = [
      ["Nombre", datos.nombre_ciudadano],
      ["RUT", datos.rut_ciudadano],
      ["Trámite", `${datos.nombre_tipo_tramite} (N° ${datos.id_tramite})`],
      ["Fecha y hora", escribirFechaHora(datos.fecha, datos.hora_inicio)],
      ["N° de cita", String(datos.id_cita)],
    ];
    for (const [etiqueta, valor] of lineas) {
      documento.fontSize(12).text(`${etiqueta}: ${valor}`);
      documento.moveDown(0.5);
    }

    documento.moveDown(1.5);
    // Si la cita se canceló, el comprobante tiene que decirlo: si no, serviría para presentarse igual
    documento.fontSize(11).text(
      datos.vigente
        ? "Preséntate 15 minutos antes con tu cédula de identidad."
        : "Esta cita fue cancelada y no es válida para presentarse.",
    );
    documento.end();
  });
}
