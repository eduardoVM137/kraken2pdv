// app/backend/models/movimiento_stock.js
import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Relaciones externas
import { Producto } from "./producto.js";
import { DetalleProducto } from "./detalle_producto.js";
import { Empleado } from "./empleado.js"; // usuario que genera el movimiento
import { Inventario } from "./inventario.js"; // ubicacion = inventario_id
import { Empresa } from "./empresa.js"; // si tienes tabla de empresa
import { Ingreso } from "./ingreso.js"; // para referencia cruzada opcional

export const MovimientoStock = pgTable("movimiento_stock", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id").notNull(),
  producto_id: integer("producto_id").notNull(),
  detalle_producto_id: integer("detalle_producto_id"),
  ubicacion_id: integer("ubicacion_id").notNull(), // normalmente equivale a Inventario.id
  cantidad: numeric("cantidad", { precision: 10, scale: 2 }).notNull(),
  precio_costo: numeric("precio_costo", { precision: 10, scale: 2 }),
  tipo_movimiento: varchar("tipo_movimiento", { length: 50 }).notNull(),
  motivo: text("motivo"),
  usuario_id: integer("usuario_id"),
  fecha: timestamp("fecha").defaultNow(),
  ubicacion_origen_id: integer("ubicacion_origen_id"),
  ubicacion_destino_id: integer("ubicacion_destino_id"),
  referencia_id: integer("referencia_id"), // opcional para ingreso_id, egreso_id, etc.
  referencia_tipo: varchar("referencia_tipo", { length: 50 }), // ej: "ingreso"
});

export const MovimientoStockRelations = relations(MovimientoStock, ({ one }) => ({
  producto: one(Producto, {
    fields: [MovimientoStock.producto_id],
    references: [Producto.id],
  }),
  detalle_producto: one(DetalleProducto, {
    fields: [MovimientoStock.detalle_producto_id],
    references: [DetalleProducto.id],
  }),
  ubicacion: one(Inventario, {
    fields: [MovimientoStock.ubicacion_id],
    references: [Inventario.id],
  }),
  empresa: one(Empresa, {
    fields: [MovimientoStock.empresa_id],
    references: [Empresa.id],
  }),
  usuario: one(Empleado, {
    fields: [MovimientoStock.usuario_id],
    references: [Empleado.id],
  }),
  ingreso_referencia: one(Ingreso, {
    fields: [MovimientoStock.referencia_id],
    references: [Ingreso.id],
  }),
}));
