import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Venta } from "./venta.js"; // si quieres la relación con ventas

export const Empleado = pgTable("empleado", {
  id:               serial("id").primaryKey(),
  codigo_empleado:  varchar("codigo_empleado", { length: 50 }),
  nombre:           varchar("nombre", { length: 100 }),
  apellidos:        varchar("apellidos", { length: 100 }),
  telefono:         varchar("telefono", { length: 50 }),
  correo:           varchar("correo", { length: 100 }),
  direccion:        varchar("direccion", { length: 255 }),
  foto:             varchar("foto", { length: 255 }),
  fecha_nacimiento: timestamp("fecha_nacimiento"),
  comentarios:      text("comentarios"),
  estado:           varchar("estado", { length: 20 }),
  state_id:         integer("state_id"),
});

export const EmpleadoRelations = relations(Empleado, ({ many }) => ({
  ventas: many(Venta, {
    fields:     [Empleado.id],
    references: [Venta.usuario_id],
  }),
}));
