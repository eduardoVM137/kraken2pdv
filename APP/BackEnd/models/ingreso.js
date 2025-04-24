import { pgTable, serial } from "drizzle-orm/pg-core";

export const Ingreso = pgTable("ingreso", {
  id: serial("id").primaryKey()
});