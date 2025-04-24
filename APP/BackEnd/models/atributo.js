import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Atributo = pgTable("atributo", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }),
});