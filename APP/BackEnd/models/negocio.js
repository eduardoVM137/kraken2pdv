import { pgTable, serial, varchar, text, boolean, integer } from "drizzle-orm/pg-core";

export const Negocio = pgTable("negocio", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id"),
  nombre: varchar("nombre", { length: 100 }),
  giro_comercial: varchar("giro_comercial", { length: 100 }),
  descripcion: text("descripcion"),
  activo: boolean("activo"),
});