import { pgTable, serial, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const Empresa = pgTable("empresa", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 150 }),
  rfc: varchar("rfc", { length: 30 }),
  correo_contacto: varchar("correo_contacto", { length: 50 }),
  telefono_contacto: varchar("telefono_contacto", { length: 30 }),
  logo: text("logo"),
  estado: boolean("estado"),
  fecha_registro: timestamp("fecha_registro", { withTimezone: false }),
});