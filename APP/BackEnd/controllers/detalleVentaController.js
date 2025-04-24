
import {
  insertarDetalleVentaService,
  editarDetalleVentaService,
  eliminarDetalleVentaService,
  mostrarDetalleVentasService,
} from '../services/detalleVentaService.js';

export const insertarDetalleVentaController = async (req, res, next) => {
  try {
    const { idventa, idempleado, idproducto, cantidad, precio, descuento, subtotal } = req.body;
    const resultado = await insertarDetalleVentaService(idventa, idempleado, idproducto, cantidad, precio, descuento, subtotal);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarDetalleVentaController = async (req, res, next) => {
  try {
    const { iddetalle_venta, ...data } = req.body;
    const resultado = await editarDetalleVentaService(iddetalle_venta, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarDetalleVentaController = async (req, res, next) => {
  try {
    const { iddetalle_venta } = req.params;
    const resultado = await eliminarDetalleVentaService(iddetalle_venta);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarDetalleVentasController = async (req, res, next) => {
  try {
    const resultado = await mostrarDetalleVentasService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
