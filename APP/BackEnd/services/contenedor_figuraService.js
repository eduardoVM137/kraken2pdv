import { db } from "../config/database.js";
import { ContenedorFigura } from "../models/contenedor_figura.js";
import { eq } from "drizzle-orm";

export const mostrarContenedorFigurasService = async () => {
  return await db.select().from(ContenedorFigura);
};

export const insertarContenedorFiguraService = async (data) => {
  const [nuevo] = await db.insert(ContenedorFigura).values(data).returning();
  return !!nuevo;
};

export const editarContenedorFiguraService = async (id, data) => {
  const [actualizado] = await db.update(ContenedorFigura).set(data).where(eq(ContenedorFigura.id, id)).returning();
  return !!actualizado;
};

export const eliminarContenedorFiguraService = async (id) => {
  const eliminado = await db.delete(ContenedorFigura).where(eq(ContenedorFigura.id, id)).returning();
  return eliminado.length > 0;
};