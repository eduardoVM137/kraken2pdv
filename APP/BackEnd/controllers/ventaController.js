
import {
  insertarVentaService,
  editarVentaService,
  eliminarVentaService,
  mostrarVentasService,
} from '../services/ventaService.js';

export const insertarVentaController = async (req, res, next) => {
  try {
    const resultado = await insertarVentaService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarVentaController = async (req, res, next) => {
  try {
    const { idventa, ...data } = req.body;
    const resultado = await editarVentaService(idventa, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarVentaController = async (req, res, next) => {
  try {
    const { idventa } = req.params;
    const resultado = await eliminarVentaService(idventa);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarVentasController = async (req, res, next) => {
  try {
    const resultado = await mostrarVentasService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
