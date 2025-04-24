// models/corteCaja.js
import { mysqlTable, serial, int, decimal, datetime } from 'drizzle-orm/mysql-core';

export const CorteCaja = mysqlTable('corte_caja', {
  idcorte_caja: serial('idcorte_caja').primaryKey(),
  idempleado_usuario: int('idempleado_usuario').notNull(),
  fecha_hora_inicio: datetime('fecha_hora_inicio').notNull(),
  fecha_hora_fin: datetime('fecha_hora_fin').notNull(),
  fondo_inicial: decimal('fondo_inicial', { precision: 18, scale: 2 }).notNull(),
  total_retiros: decimal('total_retiros', { precision: 18, scale: 2 }).notNull(),
  total_ventas: decimal('total_ventas', { precision: 18, scale: 2 }).notNull(),
  total_entregado: decimal('total_entregado', { precision: 18, scale: 2 }).notNull(),
});
