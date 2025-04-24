import { db } from "../config/database.js";
import { ContenedorInstancia } from "../models/contenedor_instancia.js";
import { eq } from "drizzle-orm";

export const mostrarContenedorInstanciasService = async () => {
  return await db.select().from(ContenedorInstancia);
};

export const insertarContenedorInstanciaService = async (data) => {
  const [nuevo] = await db.insert(ContenedorInstancia).values(data).returning();
  return !!nuevo;
};

export const editarContenedorInstanciaService = async (id, data) => {
  const [actualizado] = await db.update(ContenedorInstancia).set(data).where(eq(ContenedorInstancia.id, id)).returning();
  return !!actualizado;
};

export const eliminarContenedorInstanciaService = async (id) => {
  const eliminado = await db.delete(ContenedorInstancia).where(eq(ContenedorInstancia.id, id)).returning();
  return eliminado.length > 0;
};