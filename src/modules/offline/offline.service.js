import prisma from "../../config/prisma.js";

export async function syncOfflineSale(data, user) {
  const { offline_uuid } = data;

  // Si ya existe esa venta (cliente la intentó enviar 2 veces)
  const exists = await prisma.sale.findFirst({
    where: { offlineUUID: offline_uuid },
  });

  if (exists) return exists;

  // usar createSale del POS
  const sale = await prisma.sale.create({
    data: {
      offlineUUID: offline_uuid,
      tiendaId: data.storeId,
      userId: user.id,
      tipoDocumento: data.tipoDocumento,
      subTotal: data.subTotal,
      impuestos: data.impuestos,
      total: data.total,
      estado: "COMPLETADA",
      fromOffline: true,
    },
  });

  return sale;
}
