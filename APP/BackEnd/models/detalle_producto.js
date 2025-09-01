// import { pgTable, serial, varchar, numeric, boolean, integer } from "drizzle-orm/pg-core";

// export const DetalleProducto = pgTable("detalle_producto", {
//   id: serial("id").primaryKey(),
//   producto_id: integer("producto_id").notNull(),
//   marca_id: varchar("marca_id", { length: 100 }),
//   medida: numeric("medida", { precision: 10, scale: 2 }),
//   unidad_medida: varchar("unidad_medida", { length: 20 }),
//   descripcion: varchar("descripcion", { length: 255 }),
//   nombre_calculado: varchar("nombre_calculado", { length: 255 }),
//   activo: boolean("activo").default(true),
//   atributo_id: integer("atributo_id"),
//   state_id: integer("state_id"),
// });
 
import { pgTable, serial, varchar, numeric, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Producto } from "./producto.js";
import { Atributo } from "./atributo.js";
import { Componente } from "./componente.js";
import { Presentacion } from "./presentacion.js";
import { EtiquetaProducto } from "./etiqueta_producto.js";
import { ProductoMultimedia } from "./producto_multimedia.js";
import { ProductoUbicacion } from "./producto_ubicacion.js";
import { Inventario } from "./inventario.js";
import { DetalleProductoCelda } from "./detalle_producto_celda.js";
import { Precio } from "./precio.js";
import { State } from "./state.js";
import { DetalleState } from "./detalle_state.js";  

export const DetalleProducto = pgTable("detalle_producto", {
  id: serial("id").primaryKey(),
  producto_id: integer("producto_id").notNull(),
  marca_id: varchar("marca_id", { length: 100 }),
  medida: numeric("medida", { precision: 10, scale: 2 }),
  unidad_medida: varchar("unidad_medida", { length: 20 }),
  descripcion: varchar("descripcion", { length: 255 }),
  nombre_calculado: varchar("nombre_calculado", { length: 255 }),
  activo: boolean("activo").default(true),
  atributo_id: integer("atributo_id"),
  state_id: integer("state_id"),
});

export const DetalleProductoRelations = relations(DetalleProducto, ({ one, many }) => ({
  producto: one(Producto, {
    fields: [DetalleProducto.producto_id],
    references: [Producto.id],
  }),
  atributo: one(Atributo, {
    fields: [DetalleProducto.atributo_id],
    references: [Atributo.id],
  }),
  state: one(State, {
    fields: [DetalleProducto.state_id],
    references: [State.id],
  }),

  componentes_padre: many(Componente, {
    relationName: "componente_padre",
  }),
  componentes_hijo: many(Componente, {
    relationName: "componente_hijo",
  }),
  presentaciones: many(Presentacion),
  etiquetas: many(EtiquetaProducto),
  multimedia: many(ProductoMultimedia),
  ubicaciones: many(ProductoUbicacion),
  inventarios: many(Inventario),
  precios: many(Precio),
}));


// export const DetalleProductoRelations = relations(DetalleProducto, ({ one, many }) => ({
//   // 🔹 Clave foránea directa
//   producto: one(Producto, {
//     fields: [DetalleProducto.producto_id],
//     references: [Producto.id],
//   }),

//   atributo: one(Atributo, {
//     fields: [DetalleProducto.atributo_id],
//     references: [Atributo.id],
//   }),

//   state: one(State, {
//     fields: [DetalleProducto.state_id],
//     references: [State.id],
//   }),

//   // 🔹 Relaciones uno-a-muchos: tablas que contienen el id de DetalleProducto
//   detalle_atributo: many(DetalleAtributo, {
//     relationName: "detalle_atributo_detalle_producto", // opcional si lo defines en ambas partes
//   }),

//   componentes: many(Componente, {
//     relationName: "componentes_detalle_producto",
//   }),

//   presentaciones: many(Presentacion, {
//     relationName: "presentaciones_detalle_producto",
//   }),

//   etiquetas: many(EtiquetaProducto, {
//     relationName: "etiquetas_detalle_producto",
//   }),

//   multimedia: many(ProductoMultimedia, {
//     relationName: "multimedia_detalle_producto",
//   }),

//   ubicaciones: many(ProductoUbicacion, {
//     relationName: "ubicaciones_detalle_producto",
//   }),

//   inventarios: many(Inventario, {
//     relationName: "inventarios_detalle_producto",
//   }),

//   precios: many(Precio, {
//     relationName: "precios_detalle_producto",
//   }),
// }));
