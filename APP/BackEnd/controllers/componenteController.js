import {
  mostrarComponentesService,
  insertarComponenteService,
  editarComponenteService,
  eliminarComponenteService,
} from "../services/componenteService.js";

export const mostrarComponentesController = async (req, res, next) => {
  try {
    const data = await mostrarComponentesService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarComponenteController = async (req, res, next) => {
  try {
    const exito = await insertarComponenteService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarComponenteController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarComponenteService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarComponenteController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarComponenteService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};