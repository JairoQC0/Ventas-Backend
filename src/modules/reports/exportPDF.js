import PDFDocument from "pdfkit";

export function exportSalesPDF(sales) {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(18).text("Reporte de Ventas", { align: "center" });
  doc.moveDown();

  sales.forEach((s) => {
    doc
      .fontSize(12)
      .text(`Venta #${s.id} - S/ ${s.total}`, { bold: true })
      .text(`Fecha: ${s.fecha}`)
      .text(`Tienda: ${s.tienda.nombre}`)
      .text(`Usuario: ${s.user.nombre}`)
      .text(`Documento: ${s.tipoDocumento}`)
      .moveDown();
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
}
