import { z } from "zod";
import { listStores, createStore } from "./store.service.js";

const storeSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().nullable().optional(),
  ruc: z.string().nullable().optional(),
  contacto: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
});

export async function getStoresController(req, res, next) {
  try {
    const stores = await listStores();
    res.json(stores);
  } catch (err) {
    next(err);
  }
}

export async function createStoreController(req, res, next) {
  try {
    const data = storeSchema.parse(req.body);
    const store = await createStore(data);
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
}
