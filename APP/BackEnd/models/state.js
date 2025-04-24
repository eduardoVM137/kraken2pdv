import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const State = mysqlTable('state', {
  idstate: serial('idstate').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
});
