
import {
  insertarSubCategoriaService,
  editarSubCategoriaService,
  eliminarSubCategoriaService,
  mostrarSubCategoriasService,
} from '../services/subCategoriaService.js';

export const insertarSubCategoriaController = async (req, res, next) => {
  try {
    const resultado = await insertarSubCategoriaService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarSubCategoriaController = async (req, res, next) => {
  try {
    const { idsub_categoria, ...data } = req.body;
    const resultado = await editarSubCategoriaService(idsub_categoria, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarSubCategoriaController = async (req, res, next) => {
  try {
    const { idsub_categoria } = req.params;
    const resultado = await eliminarSubCategoriaService(idsub_categoria);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarSubCategoriasController = async (req, res, next) => {
  try {
    const resultado = await mostrarSubCategoriasService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
