import { db } from "../config/database.js";
import { Negocio } from "../models/negocio.js";
import { eq } from "drizzle-orm";

export const mostrarNegociosService = async () => {
  return await db.select().from(Negocio);
};

export const insertarNegocioService = async (data) => {
  const [nuevo] = await db.insert(Negocio).values(data).returning();
  return !!nuevo;
};

export const editarNegocioService = async (id, data) => {
  const [actualizado] = await db.update(Negocio).set(data).where(eq(Negocio.id, id)).returning();
  return !!actualizado;
};

export const eliminarNegocioService = async (id) => {
  const eliminado = await db.delete(Negocio).where(eq(Negocio.id, id)).returning();
  return eliminado.length > 0;
};