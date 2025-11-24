import prisma from "../../config/prisma.js";
import { HttpError } from "../../core/httpError.js";

export async function adjustStock(data) {
  const { productId, storeId, cantidad } = data;

  const stock = await prisma.productStock.findUnique({
    where: { productId_storeId: { productId, storeId } },
  });

  if (!stock) {
    throw new HttpError(404, "Producto no tiene stock en esta tienda");
  }

  const newValue = stock.cantidad + cantidad;
  if (newValue < 0)
    throw new HttpError(400, "Stock insuficiente para realizar el ajuste");

  return prisma.productStock.update({
    where: { id: stock.id },
    data: { cantidad: newValue },
    select: {
      id: true,
      productId: true,
      storeId: true,
      cantidad: true,
    },
  });
}
