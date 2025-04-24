import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";

export const ContenedorFigura = pgTable("contenedor_figura", {
  id: serial("id").primaryKey(),
  punto_orden: integer("punto_orden"),
  pos_x: integer("pos_x"),
  pos_y: integer("pos_y"),
  largo: varchar("largo", { length: 10 }),
  alto: varchar("alto", { length: 10 }),
  ancho: varchar("ancho", { length: 10 }),
  color_hex: varchar("color_hex", { length: 10 }),
});