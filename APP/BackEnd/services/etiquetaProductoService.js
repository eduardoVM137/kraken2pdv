import { db } from "../config/database.js";
import { EtiquetaProducto } from "../models/etiqueta_producto.js";
import { eq } from "drizzle-orm";

export const mostrarEtiquetasService = async () => {
  return await db.select().from(EtiquetaProducto);
};

export const insertarEtiquetaService = async (data) => {
  const [nueva] = await db.insert(EtiquetaProducto).values(data).returning();
  return !!nueva;
};

export const editarEtiquetaService = async (id, data) => {
  const [actualizado] = await db.update(EtiquetaProducto).set(data).where(eq(EtiquetaProducto.id, id)).returning();
  return !!actualizado;
};

export const eliminarEtiquetaService = async (id) => {
  const eliminado = await db.delete(EtiquetaProducto).where(eq(EtiquetaProducto.id, id)).returning();
  return eliminado.length > 0;
};