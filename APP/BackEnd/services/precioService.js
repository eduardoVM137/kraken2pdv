import { db } from "../config/database.js";
import { Precio } from "../models/precio.js";
import { eq } from "drizzle-orm";

export const mostrarPreciosService = async () => {
  return await db.select().from(Precio);
};

export const insertarPrecioService = async (data) => {
  const [nuevo] = await db.insert(Precio).values(data).returning();
  return !!nuevo;
};

export const editarPrecioService = async (id, data) => {
  const [actualizado] = await db.update(Precio).set(data).where(eq(Precio.id, id)).returning();
  return !!actualizado;
};

export const eliminarPrecioService = async (id) => {
  const eliminado = await db.delete(Precio).where(eq(Precio.id, id)).returning();
  return eliminado.length > 0;
};