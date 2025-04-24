
import {
  insertarStateService,
  editarStateService,
  eliminarStateService,
  mostrarStatesService,
} from '../services/stateService.js';

export const insertarStateController = async (req, res, next) => {
  try {
    const resultado = await insertarStateService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarStateController = async (req, res, next) => {
  try {
    const { idstate, ...data } = req.body;
    const resultado = await editarStateService(idstate, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarStateController = async (req, res, next) => {
  try {
    const { idstate } = req.params;
    const resultado = await eliminarStateService(idstate);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarStatesController = async (req, res, next) => {
  try {
    const resultado = await mostrarStatesService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
