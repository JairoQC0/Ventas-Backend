import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "./httpError.js";
import prisma from "../config/prisma.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HttpError(401, "Token no proporcionado");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        role: true,
        storeId: true,
        status: true,
      },
    });

    if (!user || !user.status) {
      throw new HttpError(401, "Usuario no encontrado o inactivo");
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new HttpError(401, "Token inválido o expirado"));
    }
    next(error);
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "No tienes permisos para esta acción"));
    }
    next();
  };
}
