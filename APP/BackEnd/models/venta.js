// models/venta.js
import { mysqlTable, serial, int, varchar, datetime, decimal } from 'drizzle-orm/mysql-core';

export const Venta = mysqlTable('venta', {
  idventa: serial('idventa').primaryKey(),
  idempleado_usuario: int('idempleado_usuario').notNull(),
  idcliente: int('idcliente').notNull(),
  idstate: int('idstate').notNull(),
  fecha: datetime('fecha').notNull(),
  metodo_pago: varchar('metodo_pago', { length: 50 }).notNull(),
  comprobante: varchar('comprobante', { length: 50 }),
  iva: decimal('iva', { precision: 18, scale: 2 }).notNull(),
  total: decimal('total', { precision: 18, scale: 2 }).notNull(),
  pagado: varchar('pagado', { length: 50 }).notNull(),
  comentarios: varchar('comentarios', { length: 150 }),
});
