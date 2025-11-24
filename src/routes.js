import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import storeRoutes from "./modules/stores/store.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import stockRoutes from "./modules/stocks/stock.routes.js";
import saleRoutes from "./modules/sales/sale.routes.js";
import sunatRoutes from "./modules/sunat/sunat.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";
import settingRoutes from "./modules/settings/setting.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";

export function registerRoutes(app) {
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/stores", storeRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/stock", stockRoutes);
  app.use("/api/sales", saleRoutes);
  app.use("/api/sunat", sunatRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/settings", settingRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/audit", auditRoutes);
}
