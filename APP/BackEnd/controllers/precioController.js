import {
  mostrarPreciosService,
  insertarPrecioService,
  editarPrecioService,
  eliminarPrecioService,
} from "../services/precioService.js";

export const mostrarPreciosController = async (req, res, next) => {
  try {
    const data = await mostrarPreciosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarPrecioController = async (req, res, next) => {
  try {
    const exito = await insertarPrecioService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarPrecioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarPrecioService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarPrecioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarPrecioService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};