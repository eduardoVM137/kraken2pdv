// src/models/venta.ts

import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
  timestamp,
  boolean as pgBoolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DetalleVenta } from "./detalle_venta.js";

export const Venta = pgTable("venta", {
  id:          serial("id").primaryKey(),
  usuario_id:  integer("usuario_id").notNull(),
  cliente_id:  integer("cliente_id").notNull(),
  fecha:       timestamp("fecha", { mode: "string" }).notNull(), // timestamp without time zone
  total:       numeric("total", { precision: 10, scale: 2 }).notNull(),
  forma_pago:  varchar("forma_pago", { length: 50 }).notNull(),
  state_id:    integer("state_id").notNull(),
  comprobante: varchar("comprobante", { length: 50 }).notNull(),
  iva:         numeric("iva", { precision: 4, scale: 2 }).notNull(),
  pagado:      pgBoolean("pagado").notNull().default(false),
  estado:      varchar("estado", { length: 50 }).notNull(),
});

export const VentaRelations = relations(Venta, ({ many }) => ({
  detalles: many(DetalleVenta, {
    relationName: "venta_detalles",
    fields:      [Venta.id],
    references:  [DetalleVenta.venta_id],
  }),
}));
