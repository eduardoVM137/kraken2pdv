
// ✅ 10. models/componente.js
import { pgTable, serial, integer, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleProducto } from "./detalle_producto.js";

export const Componente = pgTable("componente", {
  id: serial("id").primaryKey(),
  detalle_producto_padre_id: integer("detalle_producto_padre_id").notNull(),
  detalle_producto_hijo_id: integer("detalle_producto_hijo_id").notNull(),
  cantidad: numeric("cantidad", { precision: 10, scale: 2 }),
});

export const ComponenteRelations = relations(Componente, ({ one }) => ({
  padre: one(DetalleProducto, {
    fields: [Componente.detalle_producto_padre_id],
    references: [DetalleProducto.id],
    relationName: "componente_padre",
  }),
  hijo: one(DetalleProducto, {
    fields: [Componente.detalle_producto_hijo_id],
    references: [DetalleProducto.id],
    relationName: "componente_hijo",
  }),
}));
