import { pgTable, serial, integer, varchar, boolean } from "drizzle-orm/pg-core";

export const EtiquetaProducto = pgTable("etiqueta_producto", {
  id: serial("id").primaryKey(),
  detalle_producto_id: integer("detalle_producto_id"),
  tipo: varchar("tipo", { length: 50 }),
  alias: varchar("alias", { length: 200 }),
  visible: boolean("visible"),
  state_id: varchar("state_id", { length: 10 }),
  presentacion_id: integer("presentacion_id"),
});