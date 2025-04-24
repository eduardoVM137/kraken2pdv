// models/categoria.js
import { pgTable, serial, varchar, boolean, integer, text } from "drizzle-orm/pg-core";

export const Categoria = pgTable("categoria", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  descripcion: text("descripcion"),
  estado: boolean("estado").default(true),
  state_id: integer("state_id"),
});
