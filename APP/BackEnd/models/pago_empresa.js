import { pgTable, serial, integer, numeric, timestamp, varchar,text  } from "drizzle-orm/pg-core";

export const PagoEmpresa = pgTable("pago_empresa", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id"),
  monto: numeric("monto", { precision: 10, scale: 2 }),
  fecha: timestamp("fecha", { withTimezone: false }),
  metodo_pago: varchar("metodo_pago", { length: 50 }),
  descripcion: text("descripcion"),
});