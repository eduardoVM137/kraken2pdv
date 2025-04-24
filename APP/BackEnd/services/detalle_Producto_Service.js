import { db } from "../config/database.js";
import { DetalleProducto } from "../models/detalle_producto.js";
import { eq } from "drizzle-orm";

export const insertarDetalleProductoService = async (data) => {
  const [insertado] = await db.insert(DetalleProducto).values(data).returning();
  return !!insertado;
};

export const editarDetalleProductoService = async (id, data) => {
  const [actualizado] = await db
    .update(DetalleProducto)
    .set(data)
    .where(eq(DetalleProducto.id, id))
    .returning();
  return !!actualizado;
};

export const eliminarDetalleProductoService = async (id) => {
  const eliminado = await db
    .delete(DetalleProducto)
    .where(eq(DetalleProducto.id, id))
    .returning();
  return eliminado.length > 0;
};

export const mostrarDetalleProductosService = async () => {
  return await db.select().from(DetalleProducto);
};

export const buscarDetalleProductoIdService = async (id) => {
  const [detalle] = await db
    .select()
    .from(DetalleProducto)
    .where(eq(DetalleProducto.id, id))
    .limit(1);
  return detalle || null;
};
