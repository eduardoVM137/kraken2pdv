import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";

export const ContenedorFisico = pgTable("contenedor_fisico", {
  id: serial("id").primaryKey(),
  contenedor_instancia_id: integer("contenedor_instancia_id"),
  nombre: varchar("nombre", { length: 100 }),
  descripcion: varchar("descripcion", { length: 255 }),
  ubicacion_fisica_id: integer("ubicacion_fisica_id"),
  contenedor_figura_id: integer("contenedor_figura_id"),
  tipo_contenedor_id: integer("tipo_contenedor_id"),
});