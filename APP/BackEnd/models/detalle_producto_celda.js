import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const DetalleProductoCelda = pgTable("detalle_producto_celda", {
  id: serial("id").primaryKey(),
  contenedor_fisico_id: integer("contenedor_fisico_id"),
  celda_id: integer("celda_id"),
  detalle_producto_id: integer("detalle_producto_id"),
  inventario_id: integer("inventario_id"),
  cantidad: integer("cantidad"),
});