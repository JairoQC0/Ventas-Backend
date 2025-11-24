import { getAdminDashboard, getSellerDashboard } from "./dashboard.service.js";

export async function adminDashboardController(req, res, next) {
  try {
    const data = await getAdminDashboard();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function sellerDashboardController(req, res, next) {
  try {
    const data = await getSellerDashboard(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
