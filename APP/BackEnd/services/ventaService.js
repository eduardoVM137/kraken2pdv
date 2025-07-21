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


export const buscarVentaService = async (ventaId) => {
  return await db.select().from(Venta).where(eq(Venta.id, ventaId));
};
 
export const buscarVentasService = async (ventaId) => {

  return await db
    .select({
      // ==== detalle_venta ====
      detalle_venta_id:    DetalleVenta.id,
      venta_id:           DetalleVenta.venta_id,     // snake_case tal cual
      cantidad:          DetalleVenta.cantidad,
      precio_venta:       DetalleVenta.precio_venta, // snake_case
      descuento:    DetalleVenta.descuento,
      subtotal:     DetalleVenta.subtotal,
      empleado_id:        DetalleVenta.empleado_id,  // snake_case

      // ==== detalle_producto ====
      detalle_producto_id: DetalleProducto.id,
      nombre_calculado:    DetalleProducto.nombre_calculado,
      descripcion:       DetalleProducto.descripcion,
      unidad_medida:      DetalleProducto.unidad_medida,
      marca_id:             DetalleProducto.marca_id,      // ← usa marca_id
      activo:            DetalleProducto.activo,        // si lo quieres
      // atributoId, stateId, etc. también puedes traerlos:
      // atributoId:     DetalleProducto.atributo_id,
      // estadoDetalle:  DetalleProducto.state_id,
    })
    .from(DetalleVenta)
    .innerJoin(
      DetalleProducto,
      eq(
        DetalleProducto.id,
        DetalleVenta.detalle_producto_id   // snake_case
      )
    )
    .where(
      eq(DetalleVenta.venta_id, ventaId)   // snake_case
    );
};
 
 
export const insertarVentaService = async (data) => {
  const [nuevo] = await db.insert(Venta).values(data).returning();
  return !!nuevo;
};

export const estadoVentaService = async (updates) => {
  // Esperamos un array de { id, estado }
  const resultados = await Promise.all(
    updates.map(async ({ id, estado }) => {
      const [updated] = await db
        .update(Venta)
        .set({ estado })
        .where(eq(Venta.id, id))
        .returning();
      return updated;
    })
  );
  return resultados;
};
export const editarVentaCabeceraService = async (id, data) => {
  const [actualizado] = await db.update(Venta).set(data).where(eq(Venta.id, id)).returning();
  return !!actualizado;
};


 
export const editarVentaService = async (ventaId, data) => {
  return await db.transaction(async (tx) => {
    // 1) Actualizamos la cabecera (sin tocar el total aún)
    const [cabecera] = await tx
      .update(Venta)
      .set({
        cliente_id: data.cliente_id,
        usuario_id: data.usuario_id,
        forma_pago: data.forma_pago,
        estado:     data.estado,
        // NO actualizamos `total` aquí
      })
      .where(eq(Venta.id, ventaId))
      .returning();

    if (!cabecera) {
      // venta no existe
      return false;
    }

    // 2) Si vienen detalles en el payload, los actualizamos y recalculamos subtotal de cada línea
    let nuevoTotal = 0;
    if (Array.isArray(data.detalles)) {
      for (const det of data.detalles) {
        const cantidad = parseFloat(det.cantidad)     || 0;
        const precio   = parseFloat(det.precio_venta) || 0;
        const desc     = parseFloat(det.descuento)    || 0;
        const subtotal = +(cantidad * precio - desc).toFixed(2);

        // Actualizamos la línea con su nuevo subtotal
        await tx
          .update(DetalleVenta)
          .set({
            cantidad:     det.cantidad,
            precio_venta: det.precio_venta,
            descuento:    det.descuento,
            subtotal,   // escribimos el subtotal recalculado
          })
          .where(eq(DetalleVenta.id, det.id));

        nuevoTotal += subtotal;
      }
    } else {
      // Si no recibimos líneas nuevas, leemos los subtotales existentes
      const filas = await tx
        .select({ s: DetalleVenta.subtotal })
        .from(DetalleVenta)
        .where(eq(DetalleVenta.venta_id, ventaId));
      nuevoTotal = filas.reduce((acc, { s }) => acc + parseFloat(s), 0);
    }

    // 3) Finalmente actualizamos el total de la venta con la suma de subtotales
    await tx
      .update(Venta)
      .set({ total: nuevoTotal.toFixed(2) })
      .where(eq(Venta.id, ventaId));

    return true;
  });
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