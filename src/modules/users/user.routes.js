import { Router } from "express";
import {
  createUserController,
  listUsersController,
} from "./user.controller.js";
import { authMiddleware, requireRole } from "../../core/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("ADMIN"));

router.get("/", listUsersController);
router.post("/", createUserController);

export default router;
