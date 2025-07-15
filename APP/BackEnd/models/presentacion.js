import { pgTable, serial, integer, varchar, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleProducto } from "./detalle_producto.js";

export const Presentacion = pgTable("presentacion", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  nombre: varchar("nombre", { length: 100 }),
  cantidad: numeric("cantidad", { precision: 10, scale: 4 }),
  descripcion: varchar("descripcion", { length: 255 }),
});

export const PresentacionRelations = relations(Presentacion, ({ one }) => ({
  detalle_producto: one(DetalleProducto, {
    fields: [Presentacion.detalle_producto_id],
    references: [DetalleProducto.id],
  }),
}));
