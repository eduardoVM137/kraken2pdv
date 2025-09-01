import { pgTable, serial, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleProducto } from "./detalle_producto.js";

export const ProductoUbicacion = pgTable("producto_ubicacion", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  inventario_id: integer("inventario_id"),
  negocio_id: integer("negocio_id"),
  ubicacion_fisica_id: integer("ubicacion_fisica_id"),
  precio_id: integer("precio_id"),
  compartir: boolean("compartir"),
});

export const ProductoUbicacionRelations = relations(ProductoUbicacion, ({ one }) => ({
  detalle_producto: one(DetalleProducto, {
    fields: [ProductoUbicacion.detalle_producto_id],
    references: [DetalleProducto.id],
  }),
}));