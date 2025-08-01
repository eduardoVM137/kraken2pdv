 // app/backend/models/ingreso.js
 
 import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
  boolean,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { Proveedor } from "./proveedor.js";
import { Empleado } from "./empleado.js";
import { State } from "./state.js";

export const Ingreso = pgTable("ingreso", {
  id: serial("id").primaryKey(),
  usuario_id: integer("usuario_id"),
  fecha: timestamp("fecha", { withTimezone: false }).defaultNow(),
  total: numeric("total", { precision: 10, scale: 2 }),
  proveedor_id: integer("proveedor_id"),
  state_id: integer("state_id"), // ✅ corregido
  metodo_pago: varchar("metodo_pago", { length: 80 }),
  comprobante: varchar("comprobante", { length: 50 }),
  iva: numeric("iva", { precision: 4, scale: 2 }),
  pagado: boolean("pagado"),
});

export const IngresoRelations = relations(Ingreso, ({ one }) => ({
  proveedor: one(Proveedor, {
    fields: [Ingreso.proveedor_id],
    references: [Proveedor.id],
  }),
  usuario: one(Empleado, {
    fields: [Ingreso.usuario_id],
    references: [Empleado.id],
  }),
  state: one(State, {
    fields: [Ingreso.state_id],
    references: [State.id],
  }),
}));


 // import {
//   pgTable,
//   serial,
//   integer,
//   numeric,
//   timestamp,
//   boolean,
//   text,
//   varchar
// } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";

// import { DetalleIngreso } from "./detalle_ingreso.js";
// import { Proveedor } from "./proveedor.js";
// import { Empleado } from "./empleado.js";  // o el modelo que uses para usuarios
// import { State } from "./state.js";

// export const Ingreso = pgTable("ingreso", {
//   id: serial("id").primaryKey(),
//   usuario_id: integer("usuario_id"),
//   fecha: timestamp("fecha", { withTimezone: false }).defaultNow(),
//   total: numeric("total", { precision: 10, scale: 2 }),
//   proveedor_id: integer("proveedor_id"),
//   state_id: text("state_id"),
//   metodo_pago: varchar("metodo_pago", { length: 80 }),
//   comprobante: varchar("comprobante", { length: 50 }),
//   iva: numeric("iva", { precision: 4, scale: 2 }),
//   pagado: boolean("pagado"),
// });

// export const IngresoRelations = relations(Ingreso, ({ one, many }) => ({
//   detalles: many(DetalleIngreso),
//   proveedor: one(Proveedor, {
//     fields: [Ingreso.proveedor_id],
//     references: [Proveedor.id],
//   }),
//   usuario: one(Empleado, {
//     fields: [Ingreso.usuario_id],
//     references: [Empleado.id],
//   }),
//   state: one(State, {
//     fields: [Ingreso.state_id],
//     references: [State.id],
//   }),
// }));
