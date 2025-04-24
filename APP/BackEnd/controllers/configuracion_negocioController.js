import {
  mostrarConfiguracionNegociosService,
  insertarConfiguracionNegocioService,
  editarConfiguracionNegocioService,
  eliminarConfiguracionNegocioService,
} from "../services/configuracion_negocioService.js";

export const mostrarConfiguracionNegociosController = async (req, res, next) => {
  try {
    const data = await mostrarConfiguracionNegociosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarConfiguracionNegocioController = async (req, res, next) => {
  try {
    const exito = await insertarConfiguracionNegocioService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarConfiguracionNegocioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarConfiguracionNegocioService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarConfiguracionNegocioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarConfiguracionNegocioService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};