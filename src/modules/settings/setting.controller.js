import { z } from "zod";
import { getAllSettings, updateSettings } from "./setting.service.js";

const settingsSchema = z.record(z.string());

export async function getSettingsController(req, res, next) {
  try {
    const settings = await getAllSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

export async function updateSettingsController(req, res, next) {
  try {
    const data = settingsSchema.parse(req.body);
    const result = await updateSettings(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
