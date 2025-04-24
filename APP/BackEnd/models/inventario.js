import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";

export const Inventario = pgTable("inventario", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  stock_actual: numeric("stock_actual", { precision: 10, scale: 2 }),
  stock_minimo: numeric("stock_minimo", { precision: 10, scale: 2 }),
  precio_costo: numeric("precio_costo", { precision: 10, scale: 2 }),
  actualizado_en: timestamp("actualizado_en", { withTimezone: false }),
  ubicacion_fisica_id: integer("ubicacion_fisica_id"),
  proveedor_id: integer("proveedor_id"),
  state_id: integer("state_id"),
});