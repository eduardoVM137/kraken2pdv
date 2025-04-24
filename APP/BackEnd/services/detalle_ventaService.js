import { db } from "../config/database.js";
import { DetalleVenta } from "../models/detalle_venta.js";
import { eq } from "drizzle-orm";

export const mostrarDetalleVentasService = async () => {
  return await db.select().from(DetalleVenta);
};

export const insertarDetalleVentaService = async (data) => {
  const [nuevo] = await db.insert(DetalleVenta).values(data).returning();
  return !!nuevo;
};

export const editarDetalleVentaService = async (id, data) => {
  const [actualizado] = await db.update(DetalleVenta).set(data).where(eq(DetalleVenta.id, id)).returning();
  return !!actualizado;
};

export const eliminarDetalleVentaService = async (id) => {
  const eliminado = await db.delete(DetalleVenta).where(eq(DetalleVenta.id, id)).returning();
  return eliminado.length > 0;
};