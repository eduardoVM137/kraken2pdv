import { mysqlTable, serial, int, varchar, datetime } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { State } from "./state.js";

export const DetalleState = mysqlTable("detalle_state", {
  iddetalle_state: serial("iddetalle_state").primaryKey(),
  idempleado_usuario: int("idempleado_usuario").notNull(),
  idstate: int("idstate").notNull(),
  fecha: datetime("fecha").notNull(),
  estado: varchar("estado", { length: 100 }).notNull(),
});

export const DetalleStateRelations = relations(DetalleState, ({ one }) => ({
  state: one(State, {
    fields: [DetalleState.idstate],
    references: [State.id],
  }),
}));
