import { pgTable, serial, integer, varchar, numeric } from "drizzle-orm/pg-core";

export const Presentacion = pgTable("presentacion", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  nombre: varchar("nombre", { length: 100 }),
  cantidad: numeric("cantidad", { precision: 10, scale: 4 }),
  descripcion: varchar("descripcion", { length: 255 }),
});