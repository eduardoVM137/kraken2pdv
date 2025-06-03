import { db } from "../config/database.js"; 
import { eq, isNull } from "drizzle-orm";

import { ProductoUbicacion } from "../models/producto_ubicacion.js";
import { Inventario }        from "../models/inventario.js";
import { Precio }            from "../models/precio.js";
import { UbicacionFisica }   from "../models/ubicacion_fisica.js";
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

 
export const buscarProductoUbicacionService = async (detalleId) => {
  return await db
    .select({
      // columnas de ubicacion_fisica
      ubicacion_fisica_id : UbicacionFisica.id,
      ubicacion_nombre    : UbicacionFisica.nombre,

      // columnas de inventario
      inventario_id : Inventario.id,
      stock_actual  : Inventario.stock_actual,
      stock_minimo  : Inventario.stock_minimo,
      precio_costo  : Inventario.precio_costo,
      actualizado_en: Inventario.actualizado_en,

      // columnas de precio
      precio_id      : Precio.id,
      precio_venta   : Precio.precio_venta,
      tipo_cliente_id: Precio.tipo_cliente_id,
      fecha_inicio   : Precio.fecha_inicio,
      fecha_fin      : Precio.fecha_fin,
    })
    .from(ProductoUbicacion)

    // inventario ***INNER JOIN***
    .innerJoin(
      Inventario,
      eq(Inventario.id, ProductoUbicacion.inventario_id)
    )

    // precio ***LEFT JOIN*** (puede ser null)
    .leftJoin(
      Precio,
      eq(Precio.id, ProductoUbicacion.precio_id)
    )

    // ubicacion_fisica ***INNER JOIN***
    .innerJoin(
      UbicacionFisica,
      eq(UbicacionFisica.id, ProductoUbicacion.ubicacion_fisica_id)
    )

    // filtro por detalle_producto_id
    .where(eq(ProductoUbicacion.detalle_producto_id, detalleId));
};