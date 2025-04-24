import { db } from "../config/database.js";
import { DetalleProductoCelda } from "../models/detalle_producto_celda.js";
import { eq } from "drizzle-orm";

export const mostrarDetalleProductoCeldasService = async () => {
  return await db.select().from(DetalleProductoCelda);
};

export const insertarDetalleProductoCeldaService = async (data) => {
  const [nuevo] = await db.insert(DetalleProductoCelda).values(data).returning();
  return !!nuevo;
};

export const editarDetalleProductoCeldaService = async (id, data) => {
  const [actualizado] = await db.update(DetalleProductoCelda).set(data).where(eq(DetalleProductoCelda.id, id)).returning();
  return !!actualizado;
};

export const eliminarDetalleProductoCeldaService = async (id) => {
  const eliminado = await db.delete(DetalleProductoCelda).where(eq(DetalleProductoCelda.id, id)).returning();
  return eliminado.length > 0;
};