import { db } from "../config/database.js";
import { Presentacion } from "../models/presentacion.js";
import { eq } from "drizzle-orm";
export const mostrarPresentacionesService = async () => {
  return await db.select().from(Presentacion);
};

export const insertarPresentacionService = async (data) => {
  const [nueva] = await db.insert(Presentacion).values(data).returning();
  return !!nueva;
};

export const editarPresentacionService = async (id, data) => {
  const [actualizado] = await db.update(Presentacion).set(data).where(eq(Presentacion.id, id)).returning();
  return !!actualizado;
};

export const eliminarPresentacionService = async (id) => {
  const eliminado = await db.delete(Presentacion).where(eq(Presentacion.id, id)).returning();
  return eliminado.length > 0;
};

 


export const eliminarPresentacionesServiceTx = async (tx, detalle_producto_id) => {
  await tx.delete(schema.Presentacion)
    .where(eq(schema.Presentacion.detalle_producto_id, detalle_producto_id));
};
 
export const insertarPresentacionServiceTx = async (tx, data) => {
  const [nueva] = await tx.insert(Presentacion).values(data).returning();
  return nueva;
};
 

export const buscarPresentacionesPorDetalleProductoService = async (detalle_producto_id) => {
  return await db
    .select({
      id: Presentacion.id,
      nombre: Presentacion.nombre,
      cantidad: Presentacion.cantidad,
      descripcion: Presentacion.descripcion
    })
    .from(Presentacion)
    .where(eq(Presentacion.detalle_producto_id, detalle_producto_id));
};

 
export const buscarPresentacionPorIdService = async (id) => {
  return await db
    .select()
    .from(Presentacion)
    .where(eq(Presentacion.id, id))
    .then(res => res[0]);
};
