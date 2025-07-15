import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleState } from "./detalle_state.js";

export const State = pgTable("state", {
  id: serial("id").primaryKey(),
  tabla_afectada: varchar("tabla_afectada", { length: 100 }),
  id_tabla: integer("id_tabla"),
  estado: varchar("estado", { length: 50 }),
  fecha: timestamp("fecha"),
});

export const StateRelations = relations(State, ({ many }) => ({
  detalle: many(DetalleState, {
    relationName: "estado_detallado"
  })
}));