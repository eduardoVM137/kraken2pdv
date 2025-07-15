import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleProducto } from "./detalle_producto.js";

export const Atributo = pgTable("atributo", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }),
});

export const AtributoRelations = relations(Atributo, ({ many }) => ({
  detalle_productos: many(DetalleProducto),
}));
