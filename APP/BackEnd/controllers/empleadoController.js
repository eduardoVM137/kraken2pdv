
import {
  insertarEmpleadoService,
  editarEmpleadoService,
  eliminarEmpleadoService,
  mostrarEmpleadosService,
} from '../services/empleadoService.js';

export const insertarEmpleadoController = async (req, res, next) => {
  try {
    const resultado = await insertarEmpleadoService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarEmpleadoController = async (req, res, next) => {
  try {
    const { idempleado, ...data } = req.body;
    const resultado = await editarEmpleadoService(idempleado, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarEmpleadoController = async (req, res, next) => {
  try {
    const { idempleado } = req.params;
    const resultado = await eliminarEmpleadoService(idempleado);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarEmpleadosController = async (req, res, next) => {
  try {
    const resultado = await mostrarEmpleadosService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
