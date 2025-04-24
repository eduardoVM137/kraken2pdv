import { pgTable, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";

export const Celda = pgTable("celda", {
  id: serial("id").primaryKey(),
  contenedor_fisico_id: integer("contenedor_fisico_id"),
  fila: integer("fila"),
  columna: integer("columna"),
  activa: boolean("activa"),
  capacidad_minima: numeric("capacidad_minima", { precision: 10, scale: 2 }),
  capacidad_maxima: numeric("capacidad_maxima", { precision: 10, scale: 2 }),
});