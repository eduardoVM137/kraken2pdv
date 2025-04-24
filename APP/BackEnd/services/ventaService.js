import { db } from "../config/database.js";
import { Venta } from "../models/venta.js";
import { eq } from "drizzle-orm";

export const mostrarVentasService = async () => {
  return await db.select().from(Venta);
};

export const insertarVentaService = async (data) => {
  const [nuevo] = await db.insert(Venta).values(data).returning();
  return !!nuevo;
};

export const editarVentaService = async (id, data) => {
  const [actualizado] = await db.update(Venta).set(data).where(eq(Venta.id, id)).returning();
  return !!actualizado;
};

export const eliminarVentaService = async (id) => {
  const eliminado = await db.delete(Venta).where(eq(Venta.id, id)).returning();
  return eliminado.length > 0;
};