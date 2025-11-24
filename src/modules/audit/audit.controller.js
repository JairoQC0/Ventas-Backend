import prisma from "../../config/prisma.js";

export async function getAuditLogsController(req, res, next) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { fecha: "desc" },
      include: {
        user: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });

    return res.json(logs);
  } catch (err) {
    next(err);
  }
}
