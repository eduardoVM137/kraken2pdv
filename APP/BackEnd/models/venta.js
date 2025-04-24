import { pgTable, serial } from "drizzle-orm/pg-core";

export const Venta = pgTable("venta", {
  id: serial("id").primaryKey()
});