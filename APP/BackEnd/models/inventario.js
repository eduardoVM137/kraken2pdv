// models/inventario.js
import { mysqlTable, serial, int, decimal } from 'drizzle-orm/mysql-core';

export const Inventario = mysqlTable('inventario', {
  idinventario: serial('idinventario').primaryKey(),
  idproducto: int('idproducto').notNull(),
  stock_actual: decimal('stock_actual', { precision: 18, scale: 2 }),
  stock_minimo: decimal('stock_minimo', { precision: 18, scale: 2 }),
});
