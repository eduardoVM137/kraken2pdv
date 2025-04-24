import { pgTable, serial } from "drizzle-orm/pg-core";

export const DetalleIngreso = pgTable("detalle_ingreso", {
  id: serial("id").primaryKey()
});