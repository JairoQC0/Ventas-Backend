import prisma from "../config/prisma.js";

export function audit(action) {
  return async (req, res, next) => {
    try {
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id ?? null,
          accion: action,
          detalle: JSON.stringify({
            params: req.params,
            body: req.body,
          }),
          ip: req.ip,
        },
      });
    } catch (err) {
      console.error("Error audit:", err);
    }

    next();
  };
}
