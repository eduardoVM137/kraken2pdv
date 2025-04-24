import {
  mostrarCeldasService,
  insertarCeldaService,
  editarCeldaService,
  eliminarCeldaService,
} from "../services/celdaService.js";

export const mostrarCeldasController = async (req, res, next) => {
  try {
    const data = await mostrarCeldasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarCeldaController = async (req, res, next) => {
  try {
    const exito = await insertarCeldaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarCeldaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarCeldaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarCeldaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarCeldaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};