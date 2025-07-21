import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  date,
  boolean as pgBoolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Venta } from "./venta.js"; // si quieres la relación con ventas

export const Cliente = pgTable("cliente", {
  id:               serial("id").primaryKey(),
  nombre:           varchar("nombre", { length: 150 }),
  apellidos:        varchar("apellidos", { length: 150 }).notNull().default(""),
  telefono:         varchar("telefono", { length: 20 }),
  direccion:        text("direccion"),
  correo:           varchar("correo", { length: 150 }),
  fecha_nacimiento: date("fecha_nacimiento"),
  comentarios:      varchar("comentarios", { length: 150 }),
  codigo_cliente:   varchar("codigo_cliente", { length: 50 }),
  estado:           pgBoolean("estado"),
  state_id:         integer("state_id"),
  tipo_cliente_id:  integer("tipo_cliente_id"),
});

export const ClienteRelations = relations(Cliente, ({ many }) => ({
  ventas: many(Venta, {
    fields:     [Cliente.id],
    references: [Venta.cliente_id],
  }),
}));
