import { db } from "../config/database.js";
import { Componente } from "../models/componente.js";
import { eq } from "drizzle-orm";

export const mostrarComponentesService = async () => {
  return await db.select().from(Componente);
};

export const insertarComponenteService = async (data) => {
  const [nuevo] = await db.insert(Componente).values(data).returning();
  return !!nuevo;
};

export const editarComponenteService = async (id, data) => {
  const [actualizado] = await db.update(Componente).set(data).where(eq(Componente.id, id)).returning();
  return !!actualizado;
};

export const eliminarComponenteService = async (id) => {
  const eliminado = await db.delete(Componente).where(eq(Componente.id, id)).returning();
  return eliminado.length > 0;
};