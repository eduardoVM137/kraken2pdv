
import {
  insertarCorteCajaService,
  editarCorteCajaService,
  eliminarCorteCajaService,
  mostrarCortesCajaService,
} from '../services/corteCajaService.js';

export const insertarCorteCajaController = async (req, res, next) => {
  try {
    const { idempleado_usuario, fecha_hora_inicio, fecha_hora_fin, fondo_inicial, total_retiros, total_ventas, total_entregado } = req.body;
    const resultado = await insertarCorteCajaService(idempleado_usuario, fecha_hora_inicio, fecha_hora_fin, fondo_inicial, total_retiros, total_ventas, total_entregado);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarCorteCajaController = async (req, res, next) => {
  try {
    const { idcorte_caja, idempleado_usuario, fecha_hora_inicio, fecha_hora_fin, fondo_inicial, total_retiros, total_ventas, total_entregado } = req.body;
    const resultado = await editarCorteCajaService(idcorte_caja, idempleado_usuario, fecha_hora_inicio, fecha_hora_fin, fondo_inicial, total_retiros, total_ventas, total_entregado);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarCorteCajaController = async (req, res, next) => {
  try {
    const { idcorte_caja } = req.body;
    const resultado = await eliminarCorteCajaService(idcorte_caja);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarCortesCajaController = async (req, res, next) => {
  try {
    const resultado = await mostrarCortesCajaService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
