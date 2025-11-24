import { Router } from "express";
import { syncOfflineSale } from "./offline.service.js";
import { authMiddleware } from "../../core/authMiddleware.js";

const router = Router();

router.post("/sync", authMiddleware, async (req, res, next) => {
  try {
    const sale = await syncOfflineSale(req.body, req.user);
    res.json(sale);
  } catch (err) {
    next(err);
  }
});

export default router;
