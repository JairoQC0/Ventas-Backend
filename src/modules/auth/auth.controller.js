import { z } from "zod";
import { login } from "./auth.service.js";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
});

export async function loginController(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await login(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
