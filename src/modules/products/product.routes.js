import { Router } from "express";
import {
  listProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./product.controller.js";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";
import { audit } from "../../core/audit.js";

const router = Router();

// LISTAR
router.get("/", authMiddleware, listProductsController);

// CREAR
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  audit("CREAR_PRODUCTO"),
  createProductController
);

// ACTUALIZAR
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  audit("EDITAR_PRODUCTO"),
  updateProductController
);

// ELIMINAR
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  audit("ELIMINAR_PRODUCTO"),
  deleteProductController
);

export default router;
