
import {
  insertarInventarioService,
  editarInventarioService,
  eliminarInventarioService,
  mostrarInventariosService,
} from '../services/inventarioService.js';

export const insertarInventarioController = async (req, res, next) => {
  try {
    const resultado = await insertarInventarioService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarInventarioController = async (req, res, next) => {
  try {
    const { idinventario, ...data } = req.body;
    const resultado = await editarInventarioService(idinventario, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarInventarioController = async (req, res, next) => {
  try {
    const { idinventario } = req.params;
    const resultado = await eliminarInventarioService(idinventario);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarInventariosController = async (req, res, next) => {
  try {
    const resultado = await mostrarInventariosService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
