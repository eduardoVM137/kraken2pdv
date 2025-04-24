import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const TipoContenedor = pgTable("tipo_contenedor", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }),
  color_default: varchar("color_default", { length: 20 }),
  icon_url: varchar("icon_url", { length: 255 }),
});