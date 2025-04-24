import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const State = pgTable("state", {
  id: serial("id").primaryKey(),
  tabla_afectada: varchar("tabla_afectada", { length: 100 }),
  id_tabla: integer("id_tabla"),
  estado: varchar("estado", { length: 50 }),
  fecha: timestamp("fecha"),
});
