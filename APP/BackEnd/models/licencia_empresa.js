import { pgTable, serial, integer, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const LicenciaEmpresa = pgTable("licencia_empresa", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id"),
  tipo: varchar("tipo", { length: 50 }),
  limite_modulos: integer("limite_modulos"),
  limite_usuarios: integer("limite_usuarios"),
  fecha_inicio: timestamp("fecha_inicio", { withTimezone: false }),
  fecha_fin: timestamp("fecha_fin", { withTimezone: false }),
  activa: boolean("activa"),
});