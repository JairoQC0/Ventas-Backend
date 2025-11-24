import { sendInvoiceToSunat } from "./sunat.service.js";

export async function sendSunatController(req, res, next) {
  try {
    const saleId = req.params.id;
    const result = await sendInvoiceToSunat(saleId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
