import { db } from "../config/database.js";
import { DetalleProductoCelda } from "../models/detalle_producto_celda.js";
import { eq } from "drizzle-orm";
import * as schema from "../models/schema.js"; // ✅ NECESARIO para schema.DetalleProducto

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

export const insertarDetalleProductoCeldaTx = async (tx, detalle_producto_celdaList) => {
  if (!Array.isArray(detalle_producto_celdaList) || detalle_producto_celdaList.length === 0) {
    throw new Error('la lista DetalleProductoCelda está vacía o no es válida');
  }

  const inserted = await tx.insert(DetalleProductoCelda).values(detalle_producto_celdaList).returning();
  return inserted;
};


export const buscarDetalleProductoCeldaPorDetalleProductoService = async (detalle_producto_id) => {
   return await db
     .select()
     .from(DetalleProductoCelda)
     .where(eq(DetalleProductoCelda.detalle_producto_id, detalle_producto_id));
 };