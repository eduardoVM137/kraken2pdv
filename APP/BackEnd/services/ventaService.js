import { db } from "../config/database.js"; 
import { eq, sql,and,inArray } from "drizzle-orm";

import {  DetalleProducto } from "../models/detalle_producto.js";
import {ProductoUbicacion} from "../models/producto_ubicacion.js";
import { ProductoMultimedia } from "../models/producto_multimedia.js";
import { Inventario } from "../models/inventario.js";
import { Presentacion } from "../models/presentacion.js";
import { Precio } from "../models/precio.js";
import { Venta } from "../models/venta.js";
import { DetalleVenta } from "../models/detalle_venta.js";

import { EtiquetaProducto } from "../models/etiqueta_producto.js";

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
      inventario_id: ProductoUbicacion.inventario_id,
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

//venta alias panel

export const buscarProductosPorAliasService = async (busqueda) => {
  // 1. Obtener todos los detalle_producto_id que coincidan con el alias buscado
  const aliasCoinciden = await db
    .select({ detalle_producto_id: EtiquetaProducto.detalle_producto_id })
    .from(EtiquetaProducto)
    .where(
      and(
        eq(EtiquetaProducto.visible, true),
        eq(EtiquetaProducto.alias, `${busqueda}`)
      )
    );

  const detalleIdsUnicos = [...new Set(aliasCoinciden.map(a => a.detalle_producto_id))];
  if (detalleIdsUnicos.length === 0) return [];

  // 2. Obtener los productos relacionados (como en obtenerProductosVentaCompacto)
  const registros = await db
    .select({
      detalle_producto_id: ProductoUbicacion.detalle_producto_id,
      precio_id: Precio.id,
      presentacion_id: Precio.presentacion_id,
      tipo_cliente: Precio.tipo_cliente_id,
      precio_venta: Precio.precio_venta,
      inventario_id: ProductoUbicacion.inventario_id,
      stock_actual: Inventario.stock_actual,
      nombre_calculado: DetalleProducto.nombre_calculado,
      foto: ProductoMultimedia.url_archivo,
    })
    .from(ProductoUbicacion)
    .innerJoin(Precio, eq(ProductoUbicacion.precio_id, Precio.id))
    .innerJoin(Inventario, eq(ProductoUbicacion.inventario_id, Inventario.id))
    .innerJoin(DetalleProducto, eq(ProductoUbicacion.detalle_producto_id, DetalleProducto.id))
    .leftJoin(ProductoMultimedia, eq(ProductoMultimedia.detalle_producto_id, DetalleProducto.id))
    .where(
      and(
        eq(DetalleProducto.activo, true),
        inArray(DetalleProducto.id, detalleIdsUnicos)
      )
    );

  return registros;
};


//ventas 
 
export async function crearVentaService(ventaData) {
  const {
    usuario_id,
    cliente_id,
    forma_pago,
    comprobante,
    iva,
    pagado,
    estado,
    state_id,
    detalle = []
  } = ventaData;

  // Ejecutamos TODO en una sola transacción Drizzle
  const resultado = await db.transaction(async (tx) => {
    // 1) Calcula totalVenta y sub-totales
    let totalVenta = 0;
    detalle.forEach(linea => {
      const qty       = Number(linea.cantidad);
      const precio    = Number(linea.precio_venta);
      const descuento = Number(linea.descuento || 0);
      const subtotal  = qty * precio - descuento;
      linea.subtotal  = subtotal;
      totalVenta     += subtotal;
    });

    // 2) Inserta la cabecera
    const [ventaRow] = await tx
      .insert(Venta)
      .values({
        usuario_id,
        cliente_id,
        fecha: new Date(),    // o `sql` NOW()
        total: totalVenta,
        forma_pago,
        state_id,
        comprobante,
        iva,
        pagado,
        estado
      })
      .returning();

    // 3) Inserta cada detalle y ajusta stock
    for (const linea of detalle) {
      const {
        detalle_producto_id,
        cantidad,
        precio_venta,
        subtotal,
        descuento,
        empleado_id,
        inventario_id
      } = linea;

      // 3.a) detalle_venta
      await tx.insert(DetalleVenta).values({
        venta_id:          ventaRow.id,
        detalle_producto_id,
        cantidad,
        precio_venta,
        subtotal,
        descuento,
        empleado_id
      });

      // 3.b) resta stock_actual
  await tx
    .update(Inventario)
    .set({ stock_actual: sql`stock_actual - ${cantidad}` })
    .where(eq(Inventario.id, inventario_id));
    }

    return {
      id:    ventaRow.id,
      fecha: ventaRow.fecha,
      total: totalVenta
    };
  });

  return resultado;
}