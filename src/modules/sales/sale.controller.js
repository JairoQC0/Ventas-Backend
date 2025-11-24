import prisma from "../../config/prisma.js";
import { z } from "zod";

/* =============================
   VALIDACIÓN
============================= */
const SaleSchema = z.object({
  storeId: z.number(),
  tipoDocumento: z.string(),
  payment: z.object({
    method: z.string(),
    reference: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.number(),
      cantidad: z.number(),
      precioUnitario: z.number(),
      descuento: z.number(),
    })
  ),
});

/* =============================
   LISTAR TODAS LAS VENTAS
============================= */
export async function getSalesController(req, res, next) {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { fecha: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        tienda: true,
        user: {
          select: { nombre: true, email: true },
        },
      },
    });

    return res.json(sales);
  } catch (err) {
    next(err);
  }
}

/* =============================
   OBTENER UNA VENTA POR ID
============================= */
export async function getSaleController(req, res, next) {
  try {
    const id = Number(req.params.id);
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        tienda: true,
        user: true,
      },
    });

    if (!sale) return res.status(404).json({ message: "Venta no encontrada" });

    return res.json(sale);
  } catch (err) {
    next(err);
  }
}

/* =============================
   CREAR VENTA
============================= */
export async function createSaleController(req, res, next) {
  try {
    const data = SaleSchema.parse(req.body);

    const total = data.items.reduce((acc, item) => {
      return acc + (item.precioUnitario * item.cantidad - item.descuento);
    }, 0);

    const subTotal = total / 1.18;
    const impuestos = total - subTotal;

    const sale = await prisma.sale.create({
      data: {
        tiendaId: data.storeId,
        userId: req.user.id,
        tipoDocumento: data.tipoDocumento,
        paymentMethod: data.payment.method,
        referenciaPago: data.payment.reference,
        total,
        subTotal,
        impuestos,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            cantidad: i.cantidad,
            precioUnitario: i.precioUnitario,
            descuento: i.descuento,
            subtotal: i.precioUnitario * i.cantidad - i.descuento,
          })),
        },
      },
    });

    return res.status(201).json(sale);
  } catch (err) {
    next(err);
  }
}

/* =============================
   ANULAR VENTA
============================= */
export async function voidSaleController(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { motivo } = req.body;

    const sale = await prisma.sale.update({
      where: { id },
      data: { estado: "ANULADA" },
    });

    await prisma.saleVoid.create({
      data: {
        saleId: id,
        userId: req.user.id,
        motivo,
      },
    });

    return res.json({ ok: true, message: "Venta anulada correctamente" });
  } catch (err) {
    next(err);
  }
}
