import { z } from "zod";
import { adjustStock } from "./stock.service.js";

const adjustSchema = z.object({
  productId: z.number().int(),
  storeId: z.number().int(),
  cantidad: z.number().int(),
});

export async function adjustStockController(req, res, next) {
  try {
    const payload = adjustSchema.parse(req.body);
    const result = await adjustStock(payload);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
