import { db } from "../config/database.js";
import { Producto } from "../models/producto.js";

import { Movimiento_Precio  } from "../models/movimiento_precio.js";
import { MovimientoStock} from "../models/movimiento_stock.js";
import { Inventario } from "../models/inventario.js";
import {  Precio } from "../models/precio.js";
import { eq, like, or,inArray } from "drizzle-orm";

// Insertar producto
export const insertarProductoService = async (data) => {
  const result = await db.insert(Producto).values(data).returning();
  return result[0] || null;
};

// Editar producto
export const editarProductoService = async (idproducto, data) => {
  const result = await db.update(Producto)
    .set(data)
    .where(eq(Producto.idproducto, idproducto))
    .returning();

  return result[0] || null;
};

// Eliminar producto
export const eliminarProductoService = async (idproducto) => {
  return await db.delete(Producto)
    .where(eq(Producto.idproducto, idproducto));
};

// Mostrar todos
export const mostrarProductosService = async () => {
  return await db.select().from(Producto);
};

// Buscar por ID
export const buscarProductoIdService = async (idproducto) => {
  const [producto] = await db.select()
    .from(Producto)
    .where(eq(Producto.idproducto, idproducto))
    .limit(1);

  return producto || null;
};

// Buscar por nombre o descripción
export const buscarProductoNombreDescripcionService = async (busqueda) => {
  return await db.select()
    .from(Producto)
    .where(
      or(
        like(Producto.nombre, `%${busqueda}%`),
        like(Producto.descripcion, `%${busqueda}%`)
      )
    );
};

 export async function obtenerPreciosInventarios(ids) {
  const precios = await db
    .select({
      detalle_producto_id: Precio.detalle_producto_id,
      precio_venta: Precio.precio_venta,
      vigente: Precio.vigente,
      fecha_inicio: Precio.fecha_inicio,
      ubicacion_fisica_id: Inventario.ubicacion_fisica_id,
      stock_actual: Inventario.stock_actual,
      stock_minimo: Inventario.stock_minimo,
    })
    .from(Precio)
    .innerJoin(Inventario, eq(Precio.detalle_producto_id, Inventario.detalle_producto_id))
    .where(inArray(Precio.detalle_producto_id, ids));

  return precios;
}
export async function getMovimientosPrecioByDetalleProducto(detalleProductoId) {
  const movimientos = await db
    .select()
    .from(Movimiento_Precio).innerJoin(MovimientoStock, eq(Movimiento_Precio.detalle_producto_id, MovimientoStock.detalle_producto_id))
    .where(eq(Movimiento_Precio.detalle_producto_id, detalleProductoId));

  return movimientos;
}

export async function getHistorialDetalleProducto(detalleProductoId) {
  const [stock, precio] = await Promise.all([
    db.select().from(MovimientoStock).where(eq(MovimientoStock.detalle_producto_id, detalleProductoId)),
    db.select().from(Movimiento_Precio).where(eq(Movimiento_Precio.detalle_producto_id, detalleProductoId))
  ]);

  return {
    detalle_producto_id: detalleProductoId,
    movimientos_stock: stock,
    movimientos_precio: precio
  };
}


