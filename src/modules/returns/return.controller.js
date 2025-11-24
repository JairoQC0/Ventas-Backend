import { z } from "zod";
import { createReturn } from "./return.service.js";

const returnSchema = z.object({
  saleId: z.number().int(),
  motivo: z.string(),
  items: z.array(
    z.object({
      productId: z.number().int(),
      cantidad: z.number().int(),
    })
  ),
});

export async function createReturnController(req, res, next) {
  try {
    const data = returnSchema.parse(req.body);
    const result = await createReturn(data, req.user);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
