import { db } from "../config/database.js";
import { Producto_visual_tag } from "../models/producto_visual_tag.js";
import { eq } from "drizzle-orm";

export const mostrarProducto_visual_tagsService = async () => {
  return await db.select().from(Producto_visual_tag);
};

export const insertarProducto_visual_tagService = async (data) => {
  const [nuevo] = await db.insert(Producto_visual_tag).values(data).returning();
  return !!nuevo;
};

export const editarProducto_visual_tagService = async (id, data) => {
  const [actualizado] = await db.update(Producto_visual_tag).set(data).where(eq(Producto_visual_tag.id, id)).returning();
  return !!actualizado;
};

export const eliminarProducto_visual_tagService = async (id) => {
  const eliminado = await db.delete(Producto_visual_tag).where(eq(Producto_visual_tag.id, id)).returning();
  return eliminado.length > 0;
};