import { db } from "../config/database.js";
import { TipoContenedor } from "../models/tipo_contenedor.js";
import { eq } from "drizzle-orm";

export const mostrarTipoContenedorsService = async () => {
  return await db.select().from(TipoContenedor);
};

export const insertarTipoContenedorService = async (data) => {
  const [nuevo] = await db.insert(TipoContenedor).values(data).returning();
  return !!nuevo;
};

export const editarTipoContenedorService = async (id, data) => {
  const [actualizado] = await db.update(TipoContenedor).set(data).where(eq(TipoContenedor.id, id)).returning();
  return !!actualizado;
};

export const eliminarTipoContenedorService = async (id) => {
  const eliminado = await db.delete(TipoContenedor).where(eq(TipoContenedor.id, id)).returning();
  return eliminado.length > 0;
};