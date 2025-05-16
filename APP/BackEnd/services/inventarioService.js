import { db } from "../config/database.js";
import { Inventario } from "../models/inventario.js";
import { eq } from "drizzle-orm";
import { inArray } from 'drizzle-orm';
export const mostrarInventariosService = async () => {
  return await db.select().from(Inventario);
};

export const insertarInventarioService = async (data) => {
  const [nuevo] = await db.insert(Inventario).values(data).returning();
  return !!nuevo;
};

export const editarInventarioService = async (id, data) => {
  const [actualizado] = await db.update(Inventario).set(data).where(eq(Inventario.id, id)).returning();
  return !!actualizado;
};

export const eliminarInventarioService = async (id) => {
  const eliminado = await db.delete(Inventario).where(eq(Inventario.id, id)).returning();
  return eliminado.length > 0;
};

export const insertarInventarioDesdeMovimientoTx = async (tx, data) => {
  const [insertado] = await tx.insert(Inventario).values(data).returning();
  return insertado;
};

export const buscarInventarioPorDetalleProductoService = async (detalle_producto_id) => {
  return await db
    .select()
    .from(Inventario)
    .where(eq(Inventario.detalle_producto_id, detalle_producto_id));
};
export const buscarInventariosPorIdService = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return await db.select().from(Inventario).where(inArray(Inventario.id, ids));
};