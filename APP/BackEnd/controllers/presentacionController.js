import {
  mostrarPresentacionesService,
  insertarPresentacionService,
  editarPresentacionService,
  eliminarPresentacionService
} from "../services/presentacionService.js";

export const mostrarPresentacionesController = async (req, res, next) => {
  try {
    const data = await mostrarPresentacionesService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarPresentacionController = async (req, res, next) => {
  try {
    const exito = await insertarPresentacionService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarPresentacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarPresentacionService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarPresentacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarPresentacionService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};