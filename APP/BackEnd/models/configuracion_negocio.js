import { pgTable, serial, integer, varchar, boolean } from "drizzle-orm/pg-core";

export const ConfiguracionNegocio = pgTable("configuracion_negocio", {
  id: serial("id").primaryKey(),
  negocio_id: integer("negocio_id"),
  moneda: varchar("moneda", { length: 10 }),
  idioma: varchar("idioma", { length: 5 }),
  permite_venta: boolean("permite_venta"),
  permite_descuento: boolean("permite_descuento"),
  mostrar_codigo: boolean("mostrar_codigo"),
  formato_ticket: varchar("formato_ticket", { length: 50 }),
  redondear_precio: boolean("redondear_precio"),
});