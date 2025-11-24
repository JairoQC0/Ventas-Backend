import {
  getDailySales,
  getSalesReport,
  getTopProducts,
} from "./report.service.js";
import { exportSalesExcel } from "./exportExcel.js";
import { exportSalesPDF } from "./exportPDF.js";

export async function dailySalesController(req, res, next) {
  try {
    const result = await getDailySales(req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function salesReportController(req, res, next) {
  try {
    const { from, to, storeId, userId } = req.query;
    const result = await getSalesReport({ from, to, storeId, userId });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function topProductsController(req, res, next) {
  try {
    const { from, to, storeId } = req.query;
    const result = await getTopProducts({ from, to, storeId });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function exportExcelController(req, res, next) {
  try {
    const data = await getSalesReport(req.query);
    const file = await exportSalesExcel(data);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");
    res.send(file);
  } catch (err) {
    next(err);
  }
}

export async function exportPDFController(req, res, next) {
  try {
    const data = await getSalesReport(req.query);
    const pdf = await exportSalesPDF(data);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");
    res.send(pdf);
  } catch (err) {
    next(err);
  }
}
