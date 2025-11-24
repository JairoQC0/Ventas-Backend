import prisma from "../../config/prisma.js";
import { HttpError } from "../../core/httpError.js";

export async function listStores() {
  return prisma.store.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      nombre: true,
      direccion: true,
      ruc: true,
      contacto: true,
      timezone: true,
      createdAt: true,
    },
  });
}

export async function createStore(data) {
  const exists = await prisma.store.findFirst({
    where: { nombre: data.nombre },
  });

  if (exists) {
    throw new HttpError(409, "Ya existe una tienda con ese nombre");
  }

  return prisma.store.create({
    data,
    select: {
      id: true,
      nombre: true,
      direccion: true,
      ruc: true,
      contacto: true,
      timezone: true,
    },
  });
}
