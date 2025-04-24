import { pgTable, serial } from "drizzle-orm/pg-core";

export const Cliente = pgTable("cliente", {
  id: serial("id").primaryKey()
});