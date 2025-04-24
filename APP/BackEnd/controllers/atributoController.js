import {
  mostrarAtributosService,
  insertarAtributoService,
  editarAtributoService,
  eliminarAtributoService,
} from "../services/atributoService.js";

export const mostrarAtributosController = async (req, res, next) => {
  try {
    const data = await mostrarAtributosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarAtributoController = async (req, res, next) => {
  try {
    const exito = await insertarAtributoService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarAtributoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarAtributoService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarAtributoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarAtributoService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};