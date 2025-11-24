import prisma from "../../config/prisma.js";
import { HttpError } from "../../core/httpError.js";

export async function createSale(data, user) {
  const { storeId, tipoDocumento, items, payment } = data;

  if (!items || items.length === 0) {
    throw new HttpError(400, "La venta debe contener al menos 1 item");
  }

  // Verificar tienda válida
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });
  if (!store) throw new HttpError(404, "La tienda no existe");

  // Calcular totales
  let subTotal = 0;
  let impuestos = 0;
  let total = 0;

  const itemResults = [];

  for (const it of items) {
    const product = await prisma.product.findUnique({
      where: { id: it.productId },
      include: {
        stocks: {
          where: { storeId },
          select: { id: true, cantidad: true },
        },
      },
    });

    if (!product) throw new HttpError(404, "Producto no encontrado");

    const stock = product.stocks[0];
    if (!stock)
      throw new HttpError(400, "El producto no tiene stock en esta tienda");

    if (stock.cantidad < it.cantidad)
      throw new HttpError(400, `Stock insuficiente de ${product.nombre}`);

    const precio = product.precioVenta;
    const descuento = it.descuento || 0;

    const subtotalItem = (precio - descuento) * it.cantidad;

    subTotal += subtotalItem;
    impuestos += subtotalItem * 0.18; // IGV 18% (configurable en Sprint 4)
    total = subTotal + impuestos;

    itemResults.push({
      productId: it.productId,
      cantidad: it.cantidad,
      precioUnitario: precio,
      descuento,
      subtotal: subtotalItem,
    });
  }

  // Registrar venta + items + stock (transacción)
  const sale = await prisma.$transaction(async (tx) => {
    const venta = await tx.sale.create({
      data: {
        tiendaId: storeId,
        userId: user.id,
        tipoDocumento,
        subTotal,
        impuestos,
        total,
        paymentMethod: payment.method,
        referenciaPago: payment.referenciaPago || null,
      },
    });

    for (const item of itemResults) {
      await tx.saleItem.create({
        data: {
          saleId: venta.id,
          ...item,
        },
      });

      // Actualizar stock
      await tx.productStock.update({
        where: {
          productId_storeId: {
            productId: item.productId,
            storeId,
          },
        },
        data: {
          cantidad: {
            decrement: item.cantidad,
          },
        },
      });
    }

    return venta;
  });

  return sale;
}

export async function getSale(id) {
  const sale = await prisma.sale.findUnique({
    where: { id: Number(id) },
    include: {
      items: {
        include: { product: { select: { nombre: true, sku: true } } },
      },
      user: { select: { nombre: true } },
      tienda: { select: { nombre: true } },
    },
  });

  if (!sale) throw new HttpError(404, "Venta no encontrada");
  return sale;
}
export async function voidSale(id, user) {
  const sale = await prisma.sale.findUnique({
    where: { id: Number(id) },
    include: { items: true },
  });

  if (!sale) throw new HttpError(404, "Venta no encontrada");
  if (sale.estado === "ANULADA")
    throw new HttpError(400, "La venta ya está anulada");

  // Reponer stock y registrar void
  const result = await prisma.$transaction(async (tx) => {
    // Reponer stock
    for (const item of sale.items) {
      await tx.productStock.update({
        where: {
          productId_storeId: {
            productId: item.productId,
            storeId: sale.tiendaId,
          },
        },
        data: {
          cantidad: {
            increment: item.cantidad,
          },
        },
      });
    }

    // Cambiar estado
    await tx.sale.update({
      where: { id: sale.id },
      data: { estado: "ANULADA" },
    });

    // Registrar auditoría de anulación
    const voidRecord = await tx.saleVoid.create({
      data: {
        saleId: sale.id,
        userId: user.id,
        motivo: "Anulación realizada desde POS",
      },
    });

    return voidRecord;
  });

  return result;
}
