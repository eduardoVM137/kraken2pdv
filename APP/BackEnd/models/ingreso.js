// models/ingreso.js
import { mysqlTable, serial, int, varchar, decimal, datetime } from 'drizzle-orm/mysql-core';

export const Ingreso = mysqlTable('ingreso', {
  idingreso: serial('idingreso').primaryKey(),
  idempleado: int('idempleado').notNull(),
  idproveedor: int('idproveedor').notNull(),
  idstate: int('idstate'),
  fecha: datetime('fecha').notNull(),
  metodo_pago: varchar('metodo_pago', { length: 50 }),
  comprobante: varchar('comprobante', { length: 150 }),
  iva: decimal('iva', { precision: 18, scale: 2 }),
  total: decimal('total', { precision: 18, scale: 2 }),
  pagado: varchar('pagado', { length: 50 }),
});
