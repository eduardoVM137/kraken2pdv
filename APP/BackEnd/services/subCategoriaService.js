import { db } from '../config/database.js';
import { SubCategoria } from '../models/subCategoria.js';

export const insertarSubCategoriaService = async (datos) => {
  return await db.insert(SubCategoria).values({
    idcategoria: datos.idcategoria,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
  }).execute();
};

export const editarSubCategoriaService = async (idsub_categoria, datos) => {
  return await db.update(SubCategoria).set({
    idcategoria: datos.idcategoria,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
  }).where(SubCategoria.idsub_categoria.eq(idsub_categoria)).execute();
};

export const eliminarSubCategoriaService = async (idsub_categoria) => {
  return await db.deleteFrom(SubCategoria).where(SubCategoria.idsub_categoria.eq(idsub_categoria)).execute();
};

export const mostrarSubCategoriasService = async () => {
  return await db.select().from(SubCategoria).execute();
};
