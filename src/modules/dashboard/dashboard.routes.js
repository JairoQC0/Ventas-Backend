import { Router } from "express";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";
import {
  adminDashboardController,
  sellerDashboardController,
} from "./dashboard.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/seller", sellerDashboardController);
router.get("/admin", requireRole("ADMIN"), adminDashboardController);

export default router;
