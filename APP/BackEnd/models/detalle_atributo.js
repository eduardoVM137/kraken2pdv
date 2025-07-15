 // models/detalle_atributo.js
import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";


export const DetalleAtributo = pgTable("detalle_atributo", {
  id: serial("id").primaryKey(),
  id_atributo: integer("id_atributo").notNull(),
  valor: varchar("valor", { length: 255 }).notNull(),
});

