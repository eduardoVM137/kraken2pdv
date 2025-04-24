
import {
  insertarDetalleStateService,
  editarDetalleStateService,
  eliminarDetalleStateService,
  mostrarDetalleStatesService,
} from '../services/detalleStateService.js';

export const insertarDetalleStateController = async (req, res, next) => {
  try {
    const resultado = await insertarDetalleStateService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarDetalleStateController = async (req, res, next) => {
  try {
    const { iddetalle_state, ...data } = req.body;
    const resultado = await editarDetalleStateService(iddetalle_state, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarDetalleStateController = async (req, res, next) => {
  try {
    const { iddetalle_state } = req.params;
    const resultado = await eliminarDetalleStateService(iddetalle_state);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarDetalleStatesController = async (req, res, next) => {
  try {
    const resultado = await mostrarDetalleStatesService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
