import {
    pgTable,
    serial,
    integer,
    text,
    varchar,
    boolean,
    numeric,
  } from "drizzle-orm/pg-core";
  
  export const DetalleProducto = pgTable("detalle_producto", {
    id: serial("id").primaryKey(),
    presentacion_id: integer("presentacion_id"),
    medida: numeric("medida", { precision: 10, scale: 2 }),
    unidad_medida: varchar("unidad_medida", { length: 20 }),
    marca_id: varchar("marca_id", { length: 100 }),
    descripcion: text("descripcion"),
    nombre_calculado: text("nombre_calculado"),
    activo: boolean("activo").default(true),
    producto_id: integer("producto_id"),
    atributo_id: integer("atributo_id"),
    state_id: integer("state_id"),
  });
  