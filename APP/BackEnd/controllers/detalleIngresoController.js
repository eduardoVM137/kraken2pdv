
import {
  insertarDetalleIngresoService,
  editarDetalleIngresoService,
  eliminarDetalleIngresoService,
  mostrarDetalleIngresosService,
} from '../services/detalleIngresoService.js';

export const insertarDetalleIngresoController = async (req, res, next) => {
  try {
    const { idingreso, idproducto, cantidad, precio_costo } = req.body;
    const resultado = await insertarDetalleIngresoService(idingreso, idproducto, cantidad, precio_costo);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarDetalleIngresoController = async (req, res, next) => {
  try {
    const { iddetalle_ingreso, ...data } = req.body;
    const resultado = await editarDetalleIngresoService(iddetalle_ingreso, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarDetalleIngresoController = async (req, res, next) => {
  try {
    const { iddetalle_ingreso } = req.params;
    const resultado = await eliminarDetalleIngresoService(iddetalle_ingreso);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarDetalleIngresosController = async (req, res, next) => {
  try {
    const resultado = await mostrarDetalleIngresosService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
