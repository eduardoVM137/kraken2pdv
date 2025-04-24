import { db } from "../config/database.js";
import { DetalleIngreso } from "../models/detalle_ingreso.js";
import { eq } from "drizzle-orm";

export const mostrarDetalleIngresosService = async () => {
  return await db.select().from(DetalleIngreso);
};

export const insertarDetalleIngresoService = async (data) => {
  const [nuevo] = await db.insert(DetalleIngreso).values(data).returning();
  return !!nuevo;
};

export const editarDetalleIngresoService = async (id, data) => {
  const [actualizado] = await db.update(DetalleIngreso).set(data).where(eq(DetalleIngreso.id, id)).returning();
  return !!actualizado;
};

export const eliminarDetalleIngresoService = async (id) => {
  const eliminado = await db.delete(DetalleIngreso).where(eq(DetalleIngreso.id, id)).returning();
  return eliminado.length > 0;
};