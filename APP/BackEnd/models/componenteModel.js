import { pgTable, serial, integer, numeric } from "drizzle-orm/pg-core";

export const Componente = pgTable("componente", {
  id: serial("id").primaryKey(),
  id_producto_padre: integer("id_producto_padre"),
  id_producto_hijo: integer("id_producto_hijo"),
  cantidad: numeric("cantidad", { precision: 10, scale: 2 }),
});