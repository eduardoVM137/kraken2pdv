import { db } from "../config/database.js";
import { Celda } from "../models/celda.js";
import { eq } from "drizzle-orm";

export const mostrarCeldasService = async () => {
  return await db.select().from(Celda);
};

export const insertarCeldaService = async (data) => {
  const [nuevo] = await db.insert(Celda).values(data).returning();
  return !!nuevo;
};

export const editarCeldaService = async (id, data) => {
  const [actualizado] = await db.update(Celda).set(data).where(eq(Celda.id, id)).returning();
  return !!actualizado;
};

export const eliminarCeldaService = async (id) => {
  const eliminado = await db.delete(Celda).where(eq(Celda.id, id)).returning();
  return eliminado.length > 0;
};