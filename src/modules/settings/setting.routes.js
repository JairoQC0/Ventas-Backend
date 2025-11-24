import { Router } from "express";
import {
  getSettingsController,
  updateSettingsController,
} from "./setting.controller.js";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("ADMIN"));

router.get("/", getSettingsController);
router.put("/", updateSettingsController);

export default router;
