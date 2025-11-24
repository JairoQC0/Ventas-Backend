import { z } from "zod";
import { createUser, listUsers } from "./user.service.js";

const createUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  nombre: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "VENDEDOR", "SUPERVISOR"]),
  storeId: z.number().int().positive().nullable().optional(),
});

export async function createUserController(req, res, next) {
  try {
    const payload = createUserSchema.parse(req.body);
    const user = await createUser(payload);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function listUsersController(req, res, next) {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}
