import { pgTable, serial } from "drizzle-orm/pg-core";

export const Proveedor = pgTable("proveedor", {
  id: serial("id").primaryKey()
});