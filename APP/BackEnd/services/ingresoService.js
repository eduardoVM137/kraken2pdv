import { db } from "../config/database.js";
import { Ingreso } from "../models/ingreso.js";
import { DetalleIngreso } from "../models/detalle_ingreso.js";
import { Proveedor } from "../models/proveedor.js";
import { DetalleProducto } from "../models/detalle_producto.js";
import { Inventario } from "../models/inventario.js";
import { eq, and, between, gte, lte, like, sql } from "drizzle-orm";
import { MovimientoStock } from "../models/movimiento_stock.js";


export const mostrarIngresosService = async () => {
  return await db.select().from(Ingreso);
}; 


export async function insertarIngresoService(data) {
  return await db.transaction(async tx => {
    const [ingreso] = await tx
      .insert(Ingreso)
      .values({
        factura:      data.factura,
        proveedor_id: data.proveedor_id,
        total:        data.total,
        iva:          data.iva,
        pagado:       data.pagado,
        metodo_pago:  data.metodo_pago || null,
        comprobante:  data.comprobante || null,
        state_id:     data.state_id || null
      })
      .returning({ id: Ingreso.id });

    await Promise.all(
      data.detalles.map(async (d) => {
        // Insertar detalle de ingreso
        await tx.insert(DetalleIngreso).values({
          ingreso_id:          ingreso.id,
          detalle_producto_id: d.detalle_producto_id,
          cantidad:            d.cantidad,
          precio_costo:        d.precio_venta,
          subtotal:            d.cantidad * d.precio_venta
        });

        // Recorrer distribución por inventario_id
        for (const [inventarioIdStr, cantidad] of Object.entries(d.distribucion ?? {})) {
          const inventario_id = +inventarioIdStr;

          // 1. Validar existencia y relación con el detalle_producto
          const inv = await tx.query.Inventario.findFirst({
            where: and(
              eq(Inventario.id, inventario_id),
              eq(Inventario.detalle_producto_id, d.detalle_producto_id)
            )
          });

          if (!inv) {
            throw new Error(`Inventario ID ${inventario_id} no válido para producto ${d.detalle_producto_id}`);
          }

          // 2. Actualizar stock
          await tx.update(Inventario)
            .set({
              stock_actual: sql`${Inventario.stock_actual} + ${cantidad}`,
              actualizado_en: new Date()
            })
            .where(eq(Inventario.id, inventario_id));

          // 3. Registrar movimiento de stock
        await tx.insert(MovimientoStock).values({
  empresa_id: 1,
  producto_id: 1,                      // si no lo tienes directo, lo puedes buscar
  detalle_producto_id: d.detalle_producto_id,
  ubicacion_id: inv.ubicacion_fisica_id,
  cantidad,
  precio_costo: d.precio_venta,                      // o usar `inv.precio_costo` si lo prefieres
  tipo_movimiento: "COMPRA",
  motivo: `Ingreso por factura ${data.factura}`,
  usuario_id: data.usuario_id || null,
  fecha: new Date(),
  referencia_tipo: "ingreso",
  referencia_id: ingreso.id
});

        }
      })
    );

    return ingreso.id;
  });
}

export const editarIngresoService = async (id, data) => {
  const [actualizado] = await db.update(Ingreso).set(data).where(eq(Ingreso.id, id)).returning();
  return !!actualizado;
};

export const eliminarIngresoService = async (id) => {
  const eliminado = await db.delete(Ingreso).where(eq(Ingreso.id, id)).returning();
  return eliminado.length > 0;
};


// 1. Historial de compras (con buscador y filtros)
export const buscarIngresosService = async (filtros = {}) => {
  const { estado, proveedorId, desde, hasta, usuarioId, producto } = filtros;

  let query = db.select().from(Ingreso);

  if (estado) query = query.where(eq(Ingreso.state_id, estado));
  if (proveedorId) query = query.where(eq(Ingreso.proveedor_id, proveedorId));
  if (desde && hasta) query = query.where(between(Ingreso.fecha, desde, hasta));
  if (usuarioId) query = query.where(eq(Ingreso.usuario_id, usuarioId));
  if (producto) {
    query = query.where(
      sql`${DetalleIngreso}.detalle_producto_id IN (SELECT id FROM ${DetalleProducto} WHERE nombre_calculado ILIKE ${`%${producto}%`})`
    );
  }

  return await query;
};



// 3. Pendientes por completar
export const listarIngresosPendientesService = async () => {
  return await db.select().from(Ingreso).where(eq(Ingreso.state_id, 1)); // 1 = pendiente
};

// 4. Vista de cancelados
export const listarIngresosCanceladosService = async () => {
  return await db.select().from(Ingreso).where(eq(Ingreso.state_id, 3)); // 3 = cancelado
};

// 5. Comparación de precios entre proveedores por producto
export const compararPreciosPorProductoService = async (detalleProductoId) => {
  return await db
    .select({
      proveedor: Proveedor.nombre,
      precio: DetalleIngreso.precio_costo,
      fecha: Ingreso.fecha,
    })
    .from(DetalleIngreso)
    .innerJoin(Ingreso, eq(Ingreso.id, DetalleIngreso.ingreso_id))
    .innerJoin(Proveedor, eq(Proveedor.id, Ingreso.proveedor_id))
    .where(eq(DetalleIngreso.detalle_producto_id, detalleProductoId))
    .orderBy(DetalleIngreso.precio_costo);
};

// 6. Último precio de compra por producto y proveedor
export const ultimoPrecioProductoProveedorService = async () => {
  return await db.execute(sql`
    SELECT DISTINCT ON (di.detalle_producto_id, i.proveedor_id)
      di.detalle_producto_id,
      i.proveedor_id,
      di.precio_costo,
      i.fecha
    FROM ${DetalleIngreso} di
    JOIN ${Ingreso} i ON di.ingreso_id = i.id
    ORDER BY di.detalle_producto_id, i.proveedor_id, i.fecha DESC
  `);
};

// 7. Evolución del precio de un producto
export const evolucionPrecioProductoService = async (detalleProductoId) => {
  return await db
    .select({ fecha: Ingreso.fecha, precio: DetalleIngreso.precio_costo, proveedor: Proveedor.nombre })
    .from(DetalleIngreso)
    .innerJoin(Ingreso, eq(DetalleIngreso.ingreso_id, Ingreso.id))
    .innerJoin(Proveedor, eq(Proveedor.id, Ingreso.proveedor_id))
    .where(eq(DetalleIngreso.detalle_producto_id, detalleProductoId))
    .orderBy(Ingreso.fecha);
};

// 8. Ranking de proveedores por gasto total
export const rankingProveedoresService = async () => {
  return await db.execute(sql`
    SELECT p.id, p.nombre, COUNT(i.id) AS num_ingresos, SUM(di.cantidad * di.precio_costo) AS total_comprado
    FROM ${Proveedor} p
    JOIN ${Ingreso} i ON i.proveedor_id = p.id
    JOIN ${DetalleIngreso} di ON di.ingreso_id = i.id
    GROUP BY p.id
    ORDER BY total_comprado DESC
  `);
};

// 9. Productos con disminución de precio
export const productosConPrecioBajoService = async () => {
  return await db.execute(sql`
    SELECT di.detalle_producto_id, dp.nombre_calculado, di.precio_costo,
      ROUND(AVG(di.precio_costo) OVER (PARTITION BY di.detalle_producto_id), 2) AS promedio
    FROM ${DetalleIngreso} di
    JOIN ${DetalleProducto} dp ON dp.id = di.detalle_producto_id
    WHERE di.precio_costo < (
      SELECT AVG(di2.precio_costo)
      FROM ${DetalleIngreso} di2
      WHERE di2.detalle_producto_id = di.detalle_producto_id
    )
    ORDER BY dp.id
  `);
};

// 10. Recomendación de cantidad promedio de compra
export const promedioCantidadPorProductoService = async () => {
  return await db.execute(sql`
    SELECT di.detalle_producto_id, dp.nombre_calculado,
      ROUND(AVG(di.cantidad), 2) AS promedio_cantidad,
      MAX(di.cantidad) AS maximo,
      COUNT(*) AS veces_comprado
    FROM ${DetalleIngreso} di
    JOIN ${DetalleProducto} dp ON dp.id = di.detalle_producto_id
    GROUP BY di.detalle_producto_id, dp.nombre_calculado
    HAVING COUNT(*) > 3
    ORDER BY promedio_cantidad DESC
  `);
};

 
// Retorna una compra con sus detalles y el nombre del producto

  export const getDetalleIngresoByIdService = async (ingresoId) => {
  const ingreso = await db
    .select()
    .from(Ingreso)
    .where(eq(Ingreso.id, ingresoId))
    .limit(1);

  if (ingreso.length === 0) {
    return { ingreso: null, detalles: [] };
  }

  const detalles = await db
    .select({
      detalle_ingreso_id: DetalleIngreso.id,
      detalle_producto_id: DetalleIngreso.detalle_producto_id,
      cantidad: DetalleIngreso.cantidad,
      precio_venta: DetalleIngreso.precio_costo,
      subtotal: DetalleIngreso.subtotal,
      nombre_calculado: DetalleProducto.nombre_calculado,
    })
    .from(DetalleIngreso)
    .innerJoin(
      DetalleProducto,
      eq(DetalleIngreso.detalle_producto_id, DetalleProducto.id)
    )
    .where(eq(DetalleIngreso.ingreso_id, ingresoId));

  return {
    ingreso: ingreso[0],
    detalles,
  };
};



// 11. Compras repetidas en poco tiempo
export const comprasRepetidasService = async () => {
  return await db.execute(sql`
    SELECT 
      i1.id AS ingreso_1, 
      i2.id AS ingreso_2, 
      i1.fecha AS fecha1, 
      i2.fecha AS fecha2, 
      i1.proveedor_id, 
      i1.total
    FROM ${Ingreso} i1
    JOIN ${Ingreso} i2 
      ON i1.proveedor_id = i2.proveedor_id 
      AND i1.total = i2.total 
      AND ABS(EXTRACT(EPOCH FROM (i1.fecha - i2.fecha))) < 300
    WHERE i1.id <> i2.id
  `);
};

// 12. Análisis completo de producto para compras
export const analisisProductoComprasService = async (detalleProductoId) => {
  const promedioCantidad = await db.execute(sql`
    SELECT ROUND(AVG(cantidad), 2) AS promedio_cantidad
    FROM ${DetalleIngreso}
    WHERE detalle_producto_id = ${detalleProductoId}
  `);

  const evolucionPrecio = await evolucionPrecioProductoService(detalleProductoId);

  const comparacionProveedores = await compararPreciosPorProductoService(detalleProductoId);

  const ultimoPrecios = await db.execute(sql`
    SELECT DISTINCT ON (i.proveedor_id)
      i.proveedor_id,
      di.precio_costo,
      i.fecha
    FROM ${DetalleIngreso} di
    JOIN ${Ingreso} i ON di.ingreso_id = i.id
    WHERE di.detalle_producto_id = ${detalleProductoId}
    ORDER BY i.proveedor_id, i.fecha DESC
  `);

  return {
    promedioCantidad: promedioCantidad[0]?.promedio_cantidad || 0,
    evolucionPrecio,
    comparacionProveedores,
    ultimoPrecios
  };
};
