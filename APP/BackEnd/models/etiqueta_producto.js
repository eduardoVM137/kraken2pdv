import { pgTable, serial, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleProducto } from "./detalle_producto.js";
import { Presentacion } from "./presentacion.js";

export const EtiquetaProducto = pgTable("etiqueta_producto", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  tipo: varchar("tipo", { length: 50 }),
  alias: varchar("alias", { length: 200 }),
  visible: boolean("visible"),
  state_id: varchar("state_id", { length: 10 }),
  presentacion_id: integer("presentacion_id"),
});

export const EtiquetaProductoRelations = relations(EtiquetaProducto, ({ one }) => ({
  detalle_producto: one(DetalleProducto, {
    fields: [EtiquetaProducto.detalle_producto_id],
    references: [DetalleProducto.id],
  }),
  presentacion: one(Presentacion, {
    fields: [EtiquetaProducto.presentacion_id],
    references: [Presentacion.id],
  }),
}));