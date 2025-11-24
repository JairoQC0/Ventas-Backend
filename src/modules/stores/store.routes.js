import { Router } from "express";
import {
  getStoresController,
  createStoreController,
} from "./store.controller.js";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getStoresController);
router.post("/", authMiddleware, requireRole("ADMIN"), createStoreController);

export default router;
