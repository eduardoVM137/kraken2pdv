import { db } from '../config/database.js';
import { DetalleVenta } from '../models/detalle_venta.js';

export const insertarDetalleVentaService = async (datos) => {
  return await db.insert(DetalleVenta).values({
    idventa: datos.idventa,
    idempleado: datos.idempleado,
    idproducto: datos.idproducto,
    cantidad: datos.cantidad,
    precio: datos.precio,
    descuento: datos.descuento,
    subtotal: datos.subtotal,
  }).execute();
};

export const editarDetalleVentaService = async (iddetalle_venta, datos) => {
  return await db.update(DetalleVenta).set({
    idventa: datos.idventa,
    idempleado: datos.idempleado,
    idproducto: datos.idproducto,
    cantidad: datos.cantidad,
    precio: datos.precio,
    descuento: datos.descuento,
    subtotal: datos.subtotal,
  }).where(DetalleVenta.iddetalle_venta.eq(iddetalle_venta)).execute();
};

export const eliminarDetalleVentaService = async (iddetalle_venta) => {
  return await db.deleteFrom(DetalleVenta).where(DetalleVenta.iddetalle_venta.eq(iddetalle_venta)).execute();
};

export const mostrarDetalleVentasService = async () => {
  return await db.select().from(DetalleVenta).execute();
};
