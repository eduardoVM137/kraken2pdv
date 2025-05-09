import { db } from "../config/database.js";
import { ProductoUbicacion } from "../models/producto_ubicacion.js";
import { eq } from "drizzle-orm";

export const mostrarProductoUbicacionsService = async () => {
  return await db.select().from(ProductoUbicacion);
};

export const insertarProductoUbicacionService = async (data) => {
  const [nuevo] = await db.insert(ProductoUbicacion).values(data).returning();
  return !!nuevo;
};

export const editarProductoUbicacionService = async (id, data) => {
  const [actualizado] = await db.update(ProductoUbicacion).set(data).where(eq(ProductoUbicacion.id, id)).returning();
  return !!actualizado;
};

export const eliminarProductoUbicacionService = async (id) => {
  const eliminado = await db.delete(ProductoUbicacion).where(eq(ProductoUbicacion.id, id)).returning();
  return eliminado.length > 0;
};


export const insertarProductoUbicacionDesdeMovimientoTx = async (tx, data) => {
  const [insertado] = await tx.insert(ProductoUbicacion).values(data).returning();
  return insertado;
};
 
export const buscarUbicacionesPorDetalleProductoService = async (detalle_producto_id) => {
  return await db
    .select()
    .from(ProductoUbicacion)
    .where(eq(ProductoUbicacion.detalle_producto_id, detalle_producto_id));
};