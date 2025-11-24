import prisma from "../../config/prisma.js";
import { HttpError } from "../../core/httpError.js";

export async function createReturn(data, user) {
  const { saleId, items, motivo } = data;

  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: { items: true },
  });

  if (!sale) throw new HttpError(404, "Venta no encontrada");

  const results = [];

  return prisma.$transaction(async (tx) => {
    for (const ret of items) {
      const saleItem = sale.items.find((i) => i.productId === ret.productId);
      if (!saleItem)
        throw new HttpError(400, "Producto no existe en la venta original");

      if (ret.cantidad > saleItem.cantidad)
        throw new HttpError(400, "Cantidad a devolver inválida");

      // Incrementar stock
      await tx.productStock.update({
        where: {
          productId_storeId: {
            productId: ret.productId,
            storeId: sale.tiendaId,
          },
        },
        data: { cantidad: { increment: ret.cantidad } },
      });

      // Registrar devolución
      const record = await tx.returns.create({
        data: {
          saleId,
          productId: ret.productId,
          cantidad: ret.cantidad,
          motivo,
          fecha: new Date(),
        },
      });

      results.push(record);
    }

    return results;
  });
}
