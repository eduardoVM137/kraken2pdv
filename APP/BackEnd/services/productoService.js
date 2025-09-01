import { db } from "../config/database.js";
import { Producto } from "../models/producto.js";

import { Movimiento_Precio  } from "../models/movimiento_precio.js";
import { MovimientoStock} from "../models/movimiento_stock.js";
import { Inventario } from "../models/inventario.js"; 
import { eq, like, or,inArray ,and, sql ,lte } from "drizzle-orm";


import { DetalleProducto  } from "../models/detalle_producto.js"; 
import { ProductoUbicacion} from "../models/producto_ubicacion.js";
import { EtiquetaProducto } from "../models/etiqueta_producto.js";
import {Precio} from "../models/precio.js"



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


export const mostrarProductosConPreciosService = async () => {
  const resultado = await db
    .select({
      detalle_producto_id: ProductoUbicacion.detalle_producto_id,
      nombre_calculado: DetalleProducto.nombre_calculado,
      activo: DetalleProducto.activo,
      precio_id: ProductoUbicacion.precio_id,
      precio_venta: Precio.precio_venta,
      tipo_cliente: Precio.tipo_cliente_id,
      etiqueta_id: EtiquetaProducto.id,
      alias: EtiquetaProducto.alias,
      tipo: EtiquetaProducto.tipo
    })
    .from(ProductoUbicacion)
    .leftJoin(DetalleProducto, eq(DetalleProducto.id, ProductoUbicacion.detalle_producto_id))
    .leftJoin(Precio, eq(Precio.id, ProductoUbicacion.precio_id)) // cambio clave aquí
    .leftJoin(EtiquetaProducto, eq(EtiquetaProducto.detalle_producto_id, DetalleProducto.id));
 
  return resultado;
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

export const obtenerProductosCriticos = async () => {
  return await db
    .select({
      id: DetalleProducto.id,
      nombre: DetalleProducto.nombre_calculado,
      stock_actual: Inventario.stock_actual,
      stock_minimo: Inventario.stock_minimo,
    })
    .from(DetalleProducto)
    .innerJoin(Inventario, eq(DetalleProducto.id, Inventario.detalle_producto_id))
    .where(
      and(
        eq(DetalleProducto.activo, true),
        lte(Inventario.stock_actual, Inventario.stock_minimo)
      )
    );
};
export const obtenerProductosConMetricas = async () => { 
  return await db.execute(sql`
    SELECT
      dp.id AS detalle_producto_id,
      dp.nombre_calculado AS nombre,
      COALESCE(SUM(dv.cantidad), 0) AS total_vendido,
      COUNT(dv.id) AS veces_vendido,
      ROUND(AVG(DATE_PART('day', CURRENT_DATE - v.fecha))::numeric, 1) AS rotacion_prom_dias,
      i.stock_actual,
      GREATEST(CEIL(COALESCE(SUM(dv.cantidad), 0) / 30 * 3), 5) AS stock_minimo_recomendado
    FROM detalle_producto dp
    LEFT JOIN detalle_venta dv ON dp.id = dv.detalle_producto_id
    LEFT JOIN venta v ON v.id = dv.venta_id
    LEFT JOIN inventario i ON dp.id = i.detalle_producto_id
    WHERE dp.activo = true
    GROUP BY dp.id, dp.nombre_calculado, i.stock_actual
    ORDER BY total_vendido DESC;
  `);
};

export const obtenerProductosPrioritarios = async () => {
  return await db.execute(
    sql`
      WITH ventas AS (
        SELECT
          dp.id,
          dp.nombre_calculado,
          SUM(dv.cantidad) AS total_vendida
        FROM detalle_producto dp
        JOIN detalle_venta dv ON dp.id = dv.detalle_producto_id
        WHERE dp.activo = true
        GROUP BY dp.id
      ),
      ventas_ordenadas AS (
        SELECT *,
          SUM(total_vendida) OVER (ORDER BY total_vendida DESC) AS acumulado,
          SUM(total_vendida) OVER () AS total_general
        FROM ventas
      )
      SELECT
        vo.id,
        vo.nombre_calculado AS nombre,
        vo.total_vendida AS cantidad_total_vendida,
        i.stock_actual,
        ROUND(vo.total_vendida / NULLIF(COUNT(DISTINCT DATE_TRUNC('month', v.fecha)), 0), 2) AS rotacion_mensual,
        GREATEST(CEIL((vo.total_vendida / NULLIF(COUNT(DISTINCT DATE_TRUNC('month', v.fecha)), 0)) * 1.3), 5) AS stock_recomendado
      FROM ventas_ordenadas vo
      JOIN detalle_venta dv ON dv.detalle_producto_id = vo.id
      JOIN venta v ON v.id = dv.venta_id
      LEFT JOIN inventario i ON i.detalle_producto_id = vo.id
      WHERE (vo.acumulado / vo.total_general) <= 0.8
      GROUP BY vo.id, vo.nombre_calculado, vo.total_vendida, i.stock_actual
      ORDER BY vo.total_vendida DESC;
    `
  );
};
