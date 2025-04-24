import { db } from '../config/database.js';
import { Categoria } from '../models/categoria.js';

export const insertarCategoriaService = async (data) => {
  return await db.insert(Categoria).values(data).execute();
};

export const editarCategoriaService = async (idcategoria, data) => {
  return await db.update(Categoria).set(data).where(Categoria.idcategoria.eq(idcategoria)).execute();
};

export const eliminarCategoriaService = async (idcategoria) => {
  return await db.deleteFrom(Categoria).where(Categoria.idcategoria.eq(idcategoria)).execute();
};

export const mostrarCategoriasService = async () => {
  return await db.select().from(Categoria).execute();
};
