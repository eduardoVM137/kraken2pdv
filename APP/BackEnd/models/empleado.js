import { pgTable, serial } from "drizzle-orm/pg-core";

export const Empleado = pgTable("empleado", {
  id: serial("id").primaryKey()
});