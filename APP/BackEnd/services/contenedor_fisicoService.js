import { db } from "../config/database.js";
import { ContenedorFisico } from "../models/contenedor_fisico.js";
import { eq } from "drizzle-orm";

export const mostrarContenedorFisicosService = async () => {
  return await db.select().from(ContenedorFisico);
};


export const insertarContenedorFisicoService = async (data) => {
  const [nuevo] = await db.insert(ContenedorFisico).values(data).returning();
  return !!nuevo;
};

export const editarContenedorFisicoService = async (id, data) => {
  const [actualizado] = await db.update(ContenedorFisico).set(data).where(eq(ContenedorFisico.id, id)).returning();
  return !!actualizado;
};

export const eliminarContenedorFisicoService = async (id) => {
  const eliminado = await db.delete(ContenedorFisico).where(eq(ContenedorFisico.id, id)).returning();
  return eliminado.length > 0;
};