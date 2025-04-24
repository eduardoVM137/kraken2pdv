import { db } from '../config/database.js';
import { Inventario } from '../models/inventario.js';

export const insertarInventarioService = async (datos) => {
  return await db.insert(Inventario).values({
    idproducto: datos.idproducto,
    stock_actual: datos.stock_actual,
    stock_minimo: datos.stock_minimo,
  }).execute();
};

export const editarInventarioService = async (idinventario, datos) => {
  return await db.update(Inventario).set({
    idproducto: datos.idproducto,
    stock_actual: datos.stock_actual,
    stock_minimo: datos.stock_minimo,
  }).where(Inventario.idinventario.eq(idinventario)).execute();
};

export const eliminarInventarioService = async (idinventario) => {
  return await db.deleteFrom(Inventario).where(Inventario.idinventario.eq(idinventario)).execute();
};

export const mostrarInventariosService = async () => {
  return await db.select().from(Inventario).execute();
};
