// controllers/categoriaController.js
import {
    insertarCategoriaService,
    editarCategoriaService,
    eliminarCategoriaService,
    mostrarCategoriasService,
  } from '../services/categoriaService.js';
  
  export const insertarCategoriaController = async (req, res, next) => {
    try {
      const { idempleado_usuario, nombre, descripcion } = req.body;
      const resultado = await insertarCategoriaService(idempleado_usuario, nombre, descripcion);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  
  export const editarCategoriaController = async (req, res, next) => {
    try {
      const { idcategoria, nombre, descripcion } = req.body;
      const resultado = await editarCategoriaService(idcategoria, nombre, descripcion);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  
  export const eliminarCategoriaController = async (req, res, next) => {
    try {
      const { idcategoria } = req.body;
      const resultado = await eliminarCategoriaService(idcategoria);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  
  export const mostrarCategoriasController = async (req, res, next) => {
    try {
      const resultado = await mostrarCategoriasService();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  