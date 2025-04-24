import { pgTable, serial, integer, varchar, numeric, boolean } from "drizzle-orm/pg-core";

export const UbicacionFisica = pgTable("ubicacion_fisica", {
  id: serial("id").primaryKey(),
  negocio_id: integer("negocio_id"),
  nombre: varchar("nombre", { length: 100 }),
  tipo: varchar("tipo", { length: 50 }),
  direccion: varchar("direccion", { length: 150 }),
  ciudad: varchar("ciudad", { length: 100 }),
  estado: varchar("estado", { length: 100 }),
  latitud: numeric("latitud", { precision: 10, scale: 6 }),
  longitud: numeric("longitud", { precision: 10, scale: 6 }),
  activa: boolean("activa"),
});