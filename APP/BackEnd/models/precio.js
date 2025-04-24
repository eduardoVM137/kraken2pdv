import { pgTable, serial, integer, numeric, timestamp, boolean, varchar, smallint } from "drizzle-orm/pg-core";

export const Precio = pgTable("precio", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  ubicacion_fisica_id: integer("ubicacion_fisica_id"),
  precio_venta: numeric("precio_venta", { precision: 10, scale: 2 }),
  vigente: boolean("vigente"),
  fecha_inicio: timestamp("fecha_inicio", { withTimezone: false }),
  fecha_fin: timestamp("fecha_fin", { withTimezone: false }),
  cliente_id: integer("cliente_id"),
  tipo_cliente_id: integer("tipo_cliente_id"),
  cantidad_minima: numeric("cantidad_minima", { precision: 10, scale: 2 }),
  precio_base: numeric("precio_base", { precision: 10, scale: 2 }),
  prioridad: smallint("prioridad"),
  descripcion: varchar("descripcion", { length: 150 }),
  presentacion_id: integer("presentacion_id"),
});