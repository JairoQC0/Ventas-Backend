import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // 300 requests por IP en 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes, intenta más tarde." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiados intentos de login, intenta más tarde." },
});
