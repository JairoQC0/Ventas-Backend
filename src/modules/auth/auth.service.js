import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../core/httpError.js";

export async function login({ username, password }) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { store: true },
  });

  if (!user) {
    throw new HttpError(401, "Credenciales inválidas");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new HttpError(401, "Credenciales inválidas");
  }

  if (!user.status) {
    throw new HttpError(403, "Usuario inactivo");
  }

  const payload = {
    sub: user.id,
    role: user.role,
    storeId: user.storeId,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
      storeNombre: user.store?.nombre || null,
    },
  };
}
