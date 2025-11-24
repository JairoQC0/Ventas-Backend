import { Router } from "express";
import { sendSunatController } from "./sunat.controller.js";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";

const router = Router();

router.post(
  "/:id/send",
  authMiddleware,
  requireRole("ADMIN"),
  sendSunatController
);

export default router;
