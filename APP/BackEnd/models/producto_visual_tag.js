import { pgTable, serial, integer, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const ProductoVisualTag = pgTable("producto_visual_tag", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  tag: varchar("tag", { length: 100 }),
  fuente: varchar("fuente", { length: 50 }),
  confianza: numeric("confianza", { precision: 5, scale: 2 }),
  fecha: timestamp("fecha", { withTimezone: false }),
});