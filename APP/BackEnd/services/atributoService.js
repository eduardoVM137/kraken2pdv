import { db } from "../config/database.js";
import { Atributo } from "../models/atributo.js";
import { eq } from "drizzle-orm";

export const mostrarAtributosService = async () => {
  return await db.select().from(Atributo);
};

export const insertarAtributoService = async (data) => {
  const [nuevo] = await db.insert(Atributo).values(data).returning();
  return !!nuevo;
};

export const editarAtributoService = async (id, data) => {
  const [actualizado] = await db.update(Atributo).set(data).where(eq(Atributo.id, id)).returning();
  return !!actualizado;
};

export const eliminarAtributoService = async (id) => {
  const eliminado = await db.delete(Atributo).where(eq(Atributo.id, id)).returning();
  return eliminado.length > 0;
};