import { mysqlTable, serial, int, varchar, float } from 'drizzle-orm/mysql-core';

 

export const Producto = mysqlTable('productos', {
  idproducto: serial('idproducto').primaryKey(),
  idcategoria: int('idcategoria').notNull(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  precio_costo: float('precio_costo').notNull(),
  precio_venta: float('precio_venta').notNull(),
  tipo: varchar('tipo', { length: 255 }).notNull(),
  idstate: int('idstate').notNull(),
  presentacion: varchar('presentacion', { length: 50 }),
  ubicacion: varchar('ubicacion', { length: 50 }),
  foto: varchar('foto', { length: 255 }), // Usa varchar grande como alternativa
  codigo_barras: varchar('codigo_barras', { length: 255 }),
  codigo_propio: varchar('codigo_propio', { length: 255 }),
});

