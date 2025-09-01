// src/models/detalle_venta.ts

import {
  pgTable,
  serial,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Venta } from "./venta.js";
import { DetalleProducto } from "./detalle_producto.js";

export const DetalleVenta = pgTable("detalle_venta", {
  id:                   serial("id").primaryKey(),
  venta_id:             integer("venta_id").notNull().references(() => Venta.id),
  detalle_producto_id:  integer("detalle_producto_id").notNull().references(() => DetalleProducto.id),
  cantidad:             numeric("cantidad", { precision: 10, scale: 2 }).notNull(),
  precio_venta:         numeric("precio_venta", { precision: 10, scale: 2 }).notNull(),
  subtotal:             numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  descuento:            numeric("descuento", { precision: 10, scale: 2 }).notNull().default(0),
  empleado_id:          integer("empleado_id").notNull(),
});

export const DetalleVentaRelations = relations(DetalleVenta, ({ one }) => ({
  venta: one(Venta, {
    fields:     [DetalleVenta.venta_id],
    references: [Venta.id],
  }),
  producto: one(DetalleProducto, {
    fields:     [DetalleVenta.detalle_producto_id],
    references: [DetalleProducto.id],
  }),
}));
