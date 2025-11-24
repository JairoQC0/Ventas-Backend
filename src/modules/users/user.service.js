import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";
import { HttpError } from "../../core/httpError.js";

export async function createUser(data) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username: data.username }, { email: data.email }],
    },
  });

  if (existing) {
    throw new HttpError(409, "Username o email ya registrados");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      passwordHash,
      nombre: data.nombre,
      email: data.email,
      role: data.role,
      storeId: data.storeId || null,
    },
    select: {
      id: true,
      username: true,
      nombre: true,
      email: true,
      role: true,
      storeId: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
}

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      nombre: true,
      email: true,
      role: true,
      storeId: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
