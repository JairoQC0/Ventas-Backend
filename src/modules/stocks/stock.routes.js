import { Router } from "express";
import { adjustStockController } from "./stock.controller.js";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";

const router = Router();

router.post(
  "/adjust",
  authMiddleware,
  requireRole("ADMIN"),
  adjustStockController
);

export default router;
