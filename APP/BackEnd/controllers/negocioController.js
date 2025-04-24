import {
  mostrarNegociosService,
  insertarNegocioService,
  editarNegocioService,
  eliminarNegocioService,
} from "../services/negocioService.js";

export const mostrarNegociosController = async (req, res, next) => {
  try {
    const data = await mostrarNegociosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarNegocioController = async (req, res, next) => {
  try {
    const exito = await insertarNegocioService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarNegocioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarNegocioService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarNegocioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarNegocioService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};