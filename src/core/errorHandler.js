import { HttpError } from "./httpError.js";

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details || null,
    });
  }

  return res.status(500).json({
    message: "Error interno del servidor",
  });
}
