// models/empleado.js
import { mysqlTable, serial, int, varchar, date } from 'drizzle-orm/mysql-core';

export const Empleado = mysqlTable('empleado', {
  idempleado: serial('idempleado').primaryKey(),
  codigo_empleado: varchar('codigo_empleado', { length: 50 }).notNull(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  apellidos: varchar('apellidos', { length: 200 }),
  foto: varchar('foto', { length: 150 }),
  direccion: varchar('direccion', { length: 50 }),
  telefono: varchar('telefono', { length: 50 }),
  correo: varchar('correo', { length: 150 }),
  fecha_nacimiento: date('fecha_nacimiento'),
  comentarios: varchar('comentarios', { length: 250 }),
  idstate: int('idstate'),
});
