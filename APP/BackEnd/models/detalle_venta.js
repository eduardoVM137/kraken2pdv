// models/detalleVenta.js
import { mysqlTable, serial, int, decimal } from 'drizzle-orm/mysql-core';

export const DetalleVenta = mysqlTable('detalle_venta', {
  iddetalle_venta: serial('iddetalle_venta').primaryKey(),
  idventa: int('idventa'),
  idempleado: int('idempleado'),
  idproducto: int('idproducto'),
  cantidad: decimal('cantidad', { precision: 18, scale: 2 }),
  precio: decimal('precio', { precision: 18, scale: 2 }),
  descuento: decimal('descuento', { precision: 18, scale: 2 }),
  subtotal: decimal('subtotal', { precision: 18, scale: 2 }),
});
