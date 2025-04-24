import { mysqlTable, serial, int, varchar, datetime, decimal } from 'drizzle-orm/mysql-core';

export const Retiro = mysqlTable('retiro', {
  idretiro: serial('idretiro').primaryKey(),
  idempleado_usuario: int('idempleado_usuario').notNull(),
  idcorte_caja: int('idcorte_caja').notNull(),
  fecha_hora: datetime('fecha_hora').notNull(),
  monto: decimal('monto', { precision: 18, scale: 2 }).notNull(),
  motivo: varchar('motivo', { length: 250 }).notNull(),
});
