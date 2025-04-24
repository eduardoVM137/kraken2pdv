import { mysqlTable, serial, int, varchar } from 'drizzle-orm/mysql-core';

export const Proveedor = mysqlTable('proveedor', {
  idproveedor: serial('idproveedor').primaryKey(),
  idstate: int('idstate'), // Permite valores nulos por omisión
  codigo_proveedor: varchar('codigo_proveedor', { length: 100 }), // Permite valores nulos por omisión
  nombre: varchar('nombre', { length: 250 }).notNull(),
  rfc: varchar('rfc', { length: 50 }), // Permite valores nulos por omisión
  direccion: varchar('direccion', { length: 50 }),
  telefono: varchar('telefono', { length: 20 }),
  correo: varchar('correo', { length: 150 }),
  comentarios: varchar('comentarios', { length: 250 }),
  foto: varchar('foto', { length: 150 }),// Usa varchar como alternativa a blob
});
