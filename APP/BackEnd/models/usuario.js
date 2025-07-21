// src/models/usuario.ts
import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean as pgBoolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Venta } from "./venta.js";

export const Usuario = pgTable("usuario", {
  id:              serial("id").primaryKey(),
  nombre_usuario:  varchar("nombre_usuario", { length: 100 }).notNull(),
  correo:          varchar("correo", { length: 150 }),
  activo:          pgBoolean("activo").notNull().default(true),
  creado_en:       timestamp("creado_en").notNull().defaultNow(),
  empleado_id:     integer("empleado_id"), // si enlaza a empleado
});

export const UsuarioRelations = relations(Usuario, ({ many }) => ({
  ventas: many(Venta, {
    fields:     [Usuario.id],
    references: [Venta.usuario_id],
  }),
}));
