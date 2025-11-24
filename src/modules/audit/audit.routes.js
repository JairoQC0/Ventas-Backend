import { Router } from "express";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";
import { getAuditLogsController } from "./audit.controller.js";

const router = Router();

// Solo ADMIN puede ver auditoría
router.get("/", authMiddleware, requireRole("ADMIN"), getAuditLogsController);

export default router;
