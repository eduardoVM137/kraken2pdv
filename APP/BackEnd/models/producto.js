import { pgTable, serial, varchar, text, integer, boolean } from "drizzle-orm/pg-core";

export const Producto = pgTable("producto", {
  id: serial("id").primaryKey(),

  nombre: varchar("nombre", { length: 100 }),
  descripcion: text("descripcion"),
  activo: boolean("activo").default(true),

  categoria_id: integer("categoria_id"),
  state_id: integer("state_id"),
});
