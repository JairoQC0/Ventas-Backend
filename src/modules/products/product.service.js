import prisma from "../../config/prisma.js";
import { HttpError } from "../../core/httpError.js";

export async function createProduct(data) {
  const exists = await prisma.product.findFirst({
    where: { sku: data.sku },
  });
  if (exists) throw new HttpError(409, "El SKU ya está registrado");

  return prisma.product.create({
    data,
    select: {
      id: true,
      sku: true,
      nombre: true,
      descripcion: true,
      precioVenta: true,
      costo: true,
      codigoBarra: true,
      unidadMedida: true,
      categoriaId: true,
    },
  });
}

export async function listProducts(params) {
  const { q, storeId, category, barcode } = params;

  return prisma.product.findMany({
    where: {
      AND: [
        q ? { nombre: { contains: q, mode: "insensitive" } } : {},
        category ? { categoriaId: Number(category) } : {},
        barcode ? { codigoBarra: barcode } : {},
      ],
    },
    select: {
      id: true,
      sku: true,
      nombre: true,
      descripcion: true,
      precioVenta: true,
      codigoBarra: true,
      stocks: storeId
        ? {
            where: { storeId: Number(storeId) },
            select: { cantidad: true },
          }
        : false,
    },
    orderBy: { nombre: "asc" },
  });
}
