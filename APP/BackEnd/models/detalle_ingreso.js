// models/detalleIngreso.js
import { mysqlTable, serial, int, decimal } from 'drizzle-orm/mysql-core';

export const DetalleIngreso = mysqlTable('detalle_ingreso', {
  iddetalle_ingreso: serial('iddetalle_ingreso').primaryKey(),
  idingreso: int('idingreso'),
  idproducto: int('idproducto'),
  cantidad: decimal('cantidad', { precision: 18, scale: 2 }),
  precio_costo: decimal('precio_costo', { precision: 18, scale: 2 }),
});
