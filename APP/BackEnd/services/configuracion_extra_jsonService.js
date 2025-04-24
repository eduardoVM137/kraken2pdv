import { db } from "../config/database.js";
import { ConfiguracionExtraJson } from "../models/configuracion_extra_json.js";
import { eq } from "drizzle-orm";

export const mostrarConfiguracionExtraJsonsService = async () => {
  return await db.select().from(ConfiguracionExtraJson);
};

export const insertarConfiguracionExtraJsonService = async (data) => {
  const [nuevo] = await db.insert(ConfiguracionExtraJson).values(data).returning();
  return !!nuevo;
};

export const editarConfiguracionExtraJsonService = async (id, data) => {
  const [actualizado] = await db.update(ConfiguracionExtraJson).set(data).where(eq(ConfiguracionExtraJson.id, id)).returning();
  return !!actualizado;
};

export const eliminarConfiguracionExtraJsonService = async (id) => {
  const eliminado = await db.delete(ConfiguracionExtraJson).where(eq(ConfiguracionExtraJson.id, id)).returning();
  return eliminado.length > 0;
};