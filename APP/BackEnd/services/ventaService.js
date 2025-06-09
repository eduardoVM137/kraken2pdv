import { db } from "../config/database.js"; 
import { eq, sql } from "drizzle-orm";

import {  DetalleProducto } from "../models/detalle_producto.js";
import {ProductoUbicacion} from "../models/producto_ubicacion.js";
import { ProductoMultimedia } from "../models/producto_multimedia.js";
import { Inventario } from "../models/inventario.js";
import { Presentacion } from "../models/presentacion.js";
import { Precio } from "../models/precio.js";
import { Venta } from "../models/venta.js";


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

 
export const obtenerProductosVentaCompacto = async () => {
  return await db
    .select({
      detalle_producto_id: ProductoUbicacion.detalle_producto_id,
      precio_id: Precio.id,
      presentacion_id: Precio.presentacion_id,
      tipo_cliente: Precio.tipo_cliente_id,
      precio_venta: Precio.precio_venta,
      stock_actual: Inventario.stock_actual,
      nombre_calculado: DetalleProducto.nombre_calculado,
      foto: ProductoMultimedia.url_archivo,
    })
    .from(ProductoUbicacion)
    .innerJoin(Precio, eq(ProductoUbicacion.precio_id, Precio.id))
    .innerJoin(Inventario, eq(ProductoUbicacion.inventario_id, Inventario.id))
    .innerJoin(DetalleProducto, eq(ProductoUbicacion.detalle_producto_id, DetalleProducto.id))
    .leftJoin(ProductoMultimedia, eq(ProductoMultimedia.detalle_producto_id, DetalleProducto.id))
    .where(eq(DetalleProducto.activo, true));
};

export const obtenerPresentacionesPorProducto = async () => {
  return await db.select().from(Presentacion);
};