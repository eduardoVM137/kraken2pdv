import { pgTable, serial, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const ModuloEmpresa = pgTable("modulo_empresa", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }),
  fecha: timestamp("fecha", { withTimezone: false }),
  activo: boolean("activo"),
  empresa_id: integer("empresa_id"),
});