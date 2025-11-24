import { Router } from "express";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";
import {
  dailySalesController,
  salesReportController,
  topProductsController,
  exportExcelController,
  exportPDFController,
} from "./report.controller.js";

const router = Router();

// Vendedor
router.get("/daily", authMiddleware, dailySalesController);

// Admin
router.get(
  "/sales",
  authMiddleware,
  requireRole("ADMIN"),
  salesReportController
);
router.get(
  "/top-products",
  authMiddleware,
  requireRole("ADMIN"),
  topProductsController
);

// Exportes
router.get(
  "/export/excel",
  authMiddleware,
  requireRole("ADMIN"),
  exportExcelController
);
router.get(
  "/export/pdf",
  authMiddleware,
  requireRole("ADMIN"),
  exportPDFController
);

export default router;
