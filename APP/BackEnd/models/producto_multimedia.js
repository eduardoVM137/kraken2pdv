 // models/multimedia_producto.js
import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

export const MultimediaProducto = pgTable('producto_multimedia', {
  id: serial('id').primaryKey(),
  detalle_producto_id: integer('detalle_producto_id').notNull().references(() => DetalleProducto.id),
  url_archivo: varchar('url_archivo', { length: 255 }).notNull(),
});
