
import {
  insertarProveedorService,
  editarProveedorService,
  eliminarProveedorService,
  mostrarProveedoresService,
} from '../services/proveedorService.js';

export const insertarProveedorController = async (req, res, next) => {
  try {
    const resultado = await insertarProveedorService(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarProveedorController = async (req, res, next) => {
  try {
    const { idproveedor, ...data } = req.body;
    const resultado = await editarProveedorService(idproveedor, data);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarProveedorController = async (req, res, next) => {
  try {
    const { idproveedor } = req.params;
    const resultado = await eliminarProveedorService(idproveedor);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarProveedoresController = async (req, res, next) => {
  try {
    const resultado = await mostrarProveedoresService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
