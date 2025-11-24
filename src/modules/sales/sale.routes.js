import { Router } from "express";
import {
  createSaleController,
  getSalesController,
  getSaleController,
  voidSaleController,
} from "./sale.controller.js";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";
import { audit } from "../../core/audit.js";
const router = Router();

// LISTAR TODAS LAS VENTAS
router.get("/", authMiddleware, getSalesController);

// OBTENER UNA SOLA VENTA POR ID
router.get("/:id", authMiddleware, getSaleController);

// CREAR VENTA
router.post("/", authMiddleware, createSaleController);

// ANULAR VENTA
router.post(
  "/:id/void",
  authMiddleware,
  requireRole("ADMIN"),
  voidSaleController
);
router.post("/", authMiddleware, audit("CREAR_VENTA"), createSaleController);

router.post(
  "/:id/void",
  authMiddleware,
  requireRole("ADMIN"),
  audit("ANULAR_VENTA"),
  voidSaleController
);

export default router;
