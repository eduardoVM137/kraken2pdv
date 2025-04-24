import { mysqlTable, serial, varchar, date, blob } from 'drizzle-orm/mysql-core';

export const Cliente = mysqlTable('cliente', {
  idcliente: serial('idcliente').primaryKey(),
  codigo_cliente: varchar('codigo_cliente', { length: 50 }).notNull(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  apellidos: varchar('apellidos', { length: 200 }).nullable(),
  direccion: varchar('direccion', { length: 150 }).nullable(),
  telefono: varchar('telefono', { length: 50 }).nullable(),
  correo: varchar('correo', { length: 150 }).nullable(),
  fecha_nacimiento: date('fecha_nacimiento').nullable(),
  comentarios: varchar('comentarios', { length: 250 }).nullable(),
  foto: blob('foto').nullable(),
});
