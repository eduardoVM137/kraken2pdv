import { pgTable, serial } from "drizzle-orm/pg-core";

export const DetalleVenta = pgTable("detalle_venta", {
  id: serial("id").primaryKey()
});