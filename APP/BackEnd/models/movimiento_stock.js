import { pgTable, serial, integer, numeric, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const MovimientoStock = pgTable('movimiento_stock', {
  id: serial('id').primaryKey(),
  empresa_id: integer('empresa_id').notNull(),
  producto_id: integer('producto_id').notNull(),
  detalle_producto_id: integer('detalle_producto_id'),
  ubicacion_id: integer('ubicacion_id').notNull(),
  cantidad: numeric('cantidad', { precision: 10, scale: 2 }).notNull(),
  precio_costo: numeric('precio_costo', { precision: 10, scale: 2 }),
  tipo_movimiento: varchar('tipo_movimiento', { length: 50 }).notNull(),
  motivo: text('motivo'),
  usuario_id: integer('usuario_id'),
  fecha: timestamp('fecha').defaultNow(),
  ubicacion_origen_id: integer('ubicacion_origen_id'),
  ubicacion_destino_id: integer('ubicacion_destino_id'),
  referencia_id: integer('referencia_id'),
  referencia_tipo: varchar('referencia_tipo', { length: 50 })
});