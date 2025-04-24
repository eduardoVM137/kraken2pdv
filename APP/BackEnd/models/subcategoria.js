import { mysqlTable, serial, int, varchar } from 'drizzle-orm/mysql-core';

export const SubCategoria = mysqlTable('sub_categoria', {
  idsub_categoria: serial('idsub_categoria').primaryKey(),
  idcategoria: int('idcategoria').notNull(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  descripcion: varchar('descripcion', { length: 200 }),
});
