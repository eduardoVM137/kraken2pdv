// models/componente.js
import { mysqlTable, serial, int, decimal } from 'drizzle-orm/mysql-core';

export const Componente = mysqlTable('componente', {
  idcomponente: serial('idcomponente').primaryKey(),
  idproducto: int('idproducto').notNull(),
  idproducto_item: int('idproducto_item').notNull(),
  cantidad: decimal('cantidad', { precision: 18, scale: 2 }).notNull(),
});
