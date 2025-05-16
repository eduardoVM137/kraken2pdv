import { db } from "../config/database.js";
import { Precio } from "../models/precio.js";
import { eq } from "drizzle-orm";
import { inArray } from 'drizzle-orm';
export const mostrarPreciosService = async () => {
  return await db.select().from(Precio);
};

export const insertarPrecioService = async (data) => {
  const [nuevo] = await db.insert(Precio).values(data).returning();
  return !!nuevo;
};

export const editarPrecioService = async (id, data) => {
  const [actualizado] = await db.update(Precio).set(data).where(eq(Precio.id, id)).returning();
  return !!actualizado;
};

export const eliminarPrecioService = async (id) => {
  const eliminado = await db.delete(Precio).where(eq(Precio.id, id)).returning();
  return eliminado.length > 0;
};

export const insertarPrecioDesdeMovimientoTx = async (tx, data) => {
  const [insertado] = await tx.insert(Precio).values(data).returning();
  return insertado;
};


export const buscarPreciosPorDetalleProductoService = async (detalle_producto_id) => {
  return await db
    .select()
    .from(Precio)
    .where(eq(Precio.detalle_producto_id, detalle_producto_id));
};

export const buscarPreciosPorIdService = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return await db.select().from(Precio).where(inArray(Precio.id, ids));
};