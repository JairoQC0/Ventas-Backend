import prisma from "../../config/prisma.js";

export async function getDailySales(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = await prisma.sale.aggregate({
    where: {
      userId: user.id,
      fecha: { gte: today },
      estado: "COMPLETADA",
    },
    _sum: { total: true },
  });

  return {
    totalVentasHoy: total._sum.total || 0,
  };
}
export async function getSalesReport({ from, to, storeId, userId }) {
  const where = {
    fecha: {
      gte: new Date(from),
      lte: new Date(to),
    },
  };

  if (storeId) where.tiendaId = Number(storeId);
  if (userId) where.userId = Number(userId);

  return prisma.sale.findMany({
    where,
    include: {
      user: { select: { nombre: true } },
      tienda: { select: { nombre: true } },
    },
    orderBy: { fecha: "desc" },
  });
}
export async function getTopProducts({ from, to, storeId }) {
  return prisma.saleItem.groupBy({
    by: ["productId"],
    _sum: { cantidad: true },
    where: {
      sale: {
        fecha: {
          gte: new Date(from),
          lte: new Date(to),
        },
        tiendaId: storeId ? Number(storeId) : undefined,
      },
    },
    orderBy: { _sum: { cantidad: "desc" } },
    take: 10,
  });
}
