import {
  mostrarConfiguracionExtraJsonsService,
  insertarConfiguracionExtraJsonService,
  editarConfiguracionExtraJsonService,
  eliminarConfiguracionExtraJsonService,
} from "../services/configuracion_extra_jsonService.js";

export const mostrarConfiguracionExtraJsonsController = async (req, res, next) => {
  try {
    const data = await mostrarConfiguracionExtraJsonsService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarConfiguracionExtraJsonController = async (req, res, next) => {
  try {
    const exito = await insertarConfiguracionExtraJsonService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarConfiguracionExtraJsonController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarConfiguracionExtraJsonService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarConfiguracionExtraJsonController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarConfiguracionExtraJsonService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};