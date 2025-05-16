// models/proveedor.ts
import { pgTable, serial, varchar, text, integer, boolean } from "drizzle-orm/pg-core";

export const Proveedor = pgTable("proveedor", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  contacto: varchar("contacto", { length: 100 }),
  telefono: varchar("telefono", { length: 20 }),
  direccion: text("direccion"),
  state_id: integer("state_id"),
  codigo_proveedor: varchar("codigo_proveedor", { length: 100 }),
  rfc: varchar("rfc", { length: 50 }),
  foto: varchar("foto", { length: 255 }),
  estado: boolean("estado"),
});
