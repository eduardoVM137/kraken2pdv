
import {
  insertarIngresoService,
  editarIngresoService,
  eliminarIngresoService,
  mostrarIngresosService,
} from '../services/ingresoService.js';

export const insertarIngresoController = async (req, res, next) => {
  try {
    const resultado = await insertarIngresoService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarIngresoController = async (req, res, next) => {
  try {
    const { idingreso, ...data } = req.body;
    const resultado = await editarIngresoService(idingreso, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarIngresoController = async (req, res, next) => {
  try {
    const { idingreso } = req.params;
    const resultado = await eliminarIngresoService(idingreso);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarIngresosController = async (req, res, next) => {
  try {
    const resultado = await mostrarIngresosService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
