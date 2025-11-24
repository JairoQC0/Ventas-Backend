import prisma from "../../config/prisma.js";
import { buildInvoiceXML } from "./helpers/buildXML.js";
import { signXML } from "./helpers/signXML.js";
import { sendInvoice } from "./helpers/sendToSunat.js";
import { HttpError } from "../../core/httpError.js";

export async function sendInvoiceToSunat(saleId) {
  const sale = await prisma.sale.findUnique({
    where: { id: Number(saleId) },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!sale) throw new HttpError(404, "Venta no encontrada");
  if (sale.tipoDocumento !== "FACTURA")
    throw new HttpError(400, "Solo se envían FACTURAS a SUNAT");

  const settingsRaw = await prisma.setting.findMany();
  const settings = Object.fromEntries(
    settingsRaw.map((s) => [s.clave, s.valor])
  );

  // 1. Generar XML
  const xml = buildInvoiceXML({
    sale,
    items: sale.items,
    settings,
  });

  // 2. Firmar XML
  const { xmlFirmado } = signXML(
    xml,
    settings.cert_path,
    settings.cert_password
  );

  // 3. Enviar a SUNAT
  let response;
  try {
    response = await sendInvoice(xmlFirmado, settings);
  } catch (err) {
    await prisma.invoiceSunat.create({
      data: {
        saleId,
        statusSunat: "ERROR",
        response: err.message,
      },
    });

    await prisma.sale.update({
      where: { id: saleId },
      data: { estado: "PENDIENTE_SUNAT" },
    });

    throw new HttpError(502, "Error enviando a SUNAT");
  }

  // 4. Guardar ticket/CDR
  const inv = await prisma.invoiceSunat.create({
    data: {
      saleId,
      statusSunat: "Aceptado",
      ticket: response.ticket,
      cdr: response.cdr || null,
      sentAt: new Date(),
      response: JSON.stringify(response),
    },
  });

  return inv;
}
