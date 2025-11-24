import prisma from "../../config/prisma.js";

export async function getAdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(today);
  monthStart.setDate(1);

  const [ventasHoy, ventasMes, pendientesSunat, lowStock] = await Promise.all([
    prisma.sale.aggregate({
      where: { fecha: { gte: today }, estado: "COMPLETADA" },
      _sum: { total: true },
    }),
    prisma.sale.aggregate({
      where: { fecha: { gte: monthStart }, estado: "COMPLETADA" },
      _sum: { total: true },
    }),
    prisma.sale.count({
      where: { estado: "PENDIENTE_SUNAT" },
    }),
    prisma.productStock.findMany({
      where: {
        cantidad: { lt: prisma.productStock.fields.stockMinimo },
      },
      include: {
        product: { select: { nombre: true, sku: true } },
        store: { select: { nombre: true } },
      },
      take: 20,
    }),
  ]);

  return {
    ventasHoy: ventasHoy._sum.total || 0,
    ventasMes: ventasMes._sum.total || 0,
    pendientesSunat,
    lowStock: lowStock.map((s) => ({
      product: s.product.nombre,
      sku: s.product.sku,
      store: s.store.nombre,
      cantidad: s.cantidad,
      stockMinimo: s.stockMinimo,
    })),
  };
}
export async function getSellerDashboard(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ventasHoy, ventasTotales, topToday] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        userId: user.id,
        fecha: { gte: today },
        estado: "COMPLETADA",
      },
      _sum: { total: true },
    }),
    prisma.sale.count({
      where: { userId: user.id, estado: "COMPLETADA" },
    }),
    prisma.saleItem.groupBy({
      by: ["productId"],
      _sum: { cantidad: true },
      where: {
        sale: {
          userId: user.id,
          fecha: { gte: today },
          estado: "COMPLETADA",
        },
      },
      orderBy: { _sum: { cantidad: "desc" } },
      take: 5,
    }),
  ]);

  return {
    ventasHoy: ventasHoy._sum.total || 0,
    ventasTotales,
    topToday,
  };
}
