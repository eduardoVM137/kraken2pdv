
import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
  text,
  boolean,
  timestamp
} from 'drizzle-orm/pg-core';

export const Movimiento_Precio = pgTable('movimiento_precio', {
  id: serial('id').primaryKey(),

  empresa_id: integer('empresa_id').notNull(),
  producto_id: integer('producto_id').notNull(),
  detalle_producto_id: integer('detalle_producto_id').notNull(),

  ubicacion_id: integer('ubicacion_id'),
  presentacion_id: integer('presentacion_id'),

  precio_venta: numeric('precio_venta', { precision: 10, scale: 2 }),
  precio_base: numeric('precio_base', { precision: 10, scale: 2 }),
  cantidad_minima: numeric('cantidad_minima', { precision: 10, scale: 2 }),

  tipo_movimiento: varchar('tipo_movimiento', { length: 50 }).notNull(), // ej: cambio_manual, ajuste_promocional, etc.
  motivo: text('motivo'),
  vigente: boolean('vigente').default(true),

  prioridad: integer('prioridad'),
  usuario_id: integer('usuario_id'),

  fecha: timestamp('fecha').defaultNow(),
  actualizado_en: timestamp('actualizado_en').defaultNow(),

  referencia_id: integer('referencia_id'),
  referencia_tipo: varchar('referencia_tipo', { length: 50 }),

  state_id: integer('state_id'),
});
