import { pgTable, serial, integer, numeric } from "drizzle-orm/pg-core";

export const DetalleIngreso = pgTable("detalle_ingreso", {
  id: serial("id").primaryKey(),
  ingreso_id: integer("ingreso_id").notNull(),
  detalle_producto_id: integer("detalle_producto_id").notNull(),
  cantidad: numeric("cantidad", { precision: 10, scale: 2 }).notNull(),
  precio_costo: numeric("precio_costo", { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }),
  state_id: integer("state_id")
});
