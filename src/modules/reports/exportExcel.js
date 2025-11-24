import ExcelJS from "exceljs";

export async function exportSalesExcel(sales) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Ventas");

  ws.addRow(["ID", "Fecha", "Tienda", "Usuario", "Total", "Documento"]);

  sales.forEach((s) => {
    ws.addRow([
      s.id,
      s.fecha,
      s.tienda.nombre,
      s.user.nombre,
      s.total,
      s.tipoDocumento,
    ]);
  });

  const buffer = await wb.xlsx.writeBuffer();
  return buffer;
}
