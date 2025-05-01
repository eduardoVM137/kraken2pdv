// models/componente.js
import { mysqlTable, serial, int, decimal } from 'drizzle-orm/mysql-core';

export const Componente = mysqlTable('componente', {
  id: serial('id').primaryKey(),
  detalle_producto_padre_id: int('detalle_producto_padre_id').notNull(),
  detalle_producto_hijo_id: int('detalle_producto_hijo_id').notNull(),
  cantidad: decimal('cantidad', { precision: 18, scale: 2 }).notNull(),
});
