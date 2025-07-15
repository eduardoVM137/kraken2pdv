 // models/multimedia_producto.js

import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleProducto } from "./detalle_producto.js";

export const ProductoMultimedia = pgTable("producto_multimedia", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id").notNull(),
  url_archivo: varchar("url_archivo", { length: 255 }).notNull(),
});

export const ProductoMultimediaRelations = relations(ProductoMultimedia, ({ one }) => ({
  detalle_producto: one(DetalleProducto, {
    fields: [ProductoMultimedia.detalle_producto_id],
    references: [DetalleProducto.id],
  }),
}));
