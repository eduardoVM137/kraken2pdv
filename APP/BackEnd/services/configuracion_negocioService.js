import { db } from "../config/database.js";
import { ConfiguracionNegocio } from "../models/configuracion_negocio.js";
import { eq } from "drizzle-orm";

export const mostrarConfiguracionNegociosService = async () => {
  return await db.select().from(ConfiguracionNegocio);
};

export const insertarConfiguracionNegocioService = async (data) => {
  const [nuevo] = await db.insert(ConfiguracionNegocio).values(data).returning();
  return !!nuevo;
};

export const editarConfiguracionNegocioService = async (id, data) => {
  const [actualizado] = await db.update(ConfiguracionNegocio).set(data).where(eq(ConfiguracionNegocio.id, id)).returning();
  return !!actualizado;
};

export const eliminarConfiguracionNegocioService = async (id) => {
  const eliminado = await db.delete(ConfiguracionNegocio).where(eq(ConfiguracionNegocio.id, id)).returning();
  return eliminado.length > 0;
};