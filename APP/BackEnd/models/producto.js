import { pgTable, serial, varchar, text, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleProducto } from "./detalle_producto.js";

export const Producto = pgTable("producto", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }),
  descripcion: text("descripcion"),
  activo: boolean("activo").default(true),
  categoria_id: integer("categoria_id"),
  state_id: integer("state_id"),
});

export const ProductoRelations = relations(Producto, ({ many }) => ({
  detalle_productos: many(DetalleProducto, {
    relationName: "productos",
  }),
}));