import { pgTable, serial, integer, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const ConfiguracionExtraJson = pgTable("configuracion_extra_json", {
  id: serial("id").primaryKey(),
  tipo_entidad: integer("tipo_entidad"),
  id_referencia: integer("id_referencia"),
  json_config: jsonb("json_config"),
  fecha_creacion: timestamp("fecha_creacion", { withTimezone: false }),
  configuracion_negocio_id: integer("configuracion_negocio_id"),
});