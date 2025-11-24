import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().transform(Number).default("4000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("1d"),
  LOG_LEVEL: z.string().default("dev"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Error en variables de entorno:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
