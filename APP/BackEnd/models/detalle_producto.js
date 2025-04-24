import { pgTable, serial, varchar, numeric, boolean, integer } from "drizzle-orm/pg-core";

export const DetalleProducto = pgTable("detalle_producto", {
  id: serial("id").primaryKey(),
  producto_id: integer("producto_id").notNull(),
  marca_id: varchar("marca_id", { length: 100 }),
  medida: numeric("medida", { precision: 10, scale: 2 }),
  unidad_medida: varchar("unidad_medida", { length: 20 }),
  descripcion: varchar("descripcion", { length: 255 }),
  nombre_calculado: varchar("nombre_calculado", { length: 255 }),
  activo: boolean("activo").default(true),
  atributo_id: integer("atributo_id"),
  state_id: integer("state_id"),
});
