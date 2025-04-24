// models/categoria.js
import { mysqlTable, serial, int, varchar } from 'drizzle-orm/mysql-core';

export const Categoria = mysqlTable('categoria', {
  idcategoria: serial('idcategoria').primaryKey(),
  idstate: int('idstate'),
  nombre: varchar('nombre', { length: 100 }),
  descripcion: varchar('descripcion', { length: 200 }),
});