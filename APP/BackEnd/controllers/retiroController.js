
import {
  insertarRetiroService,
  editarRetiroService,
  eliminarRetiroService,
  mostrarRetirosService,
} from '../services/retiroService.js';

export const insertarRetiroController = async (req, res, next) => {
  try {
    const resultado = await insertarRetiroService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarRetiroController = async (req, res, next) => {
  try {
    const { idretiro, ...data } = req.body;
    const resultado = await editarRetiroService(idretiro, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarRetiroController = async (req, res, next) => {
  try {
    const { idretiro } = req.params;
    const resultado = await eliminarRetiroService(idretiro);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarRetirosController = async (req, res, next) => {
  try {
    const resultado = await mostrarRetirosService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
