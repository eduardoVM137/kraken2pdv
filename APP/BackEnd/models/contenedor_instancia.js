import { pgTable, serial, integer, varchar, boolean, numeric } from "drizzle-orm/pg-core";

export const ContenedorInstancia = pgTable("contenedor_instancia", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id"),
  nombre_personalizado: varchar("nombre_personalizado", { length: 255 }),
  visible: boolean("visible"),
  rotacion: integer("rotacion"),
  escala: numeric("escala", { precision: 4, scale: 2 }),
  z_index: integer("z_index"),
});