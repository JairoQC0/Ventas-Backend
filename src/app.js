import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./core/errorHandler.js";
import { registerRoutes } from "./routes.js";
import { apiLimiter } from "./core/rateLimit.js";

const app = express();

if (env.NODE_ENV === "production" && env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.LOG_LEVEL));

// Aplica rate limit global a toda la API
app.use("/api", apiLimiter);

registerRoutes(app);

app.use(errorHandler);

export default app;
