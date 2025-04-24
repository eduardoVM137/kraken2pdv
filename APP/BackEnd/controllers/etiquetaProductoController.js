import {
  mostrarEtiquetasService,
  insertarEtiquetaService,
  editarEtiquetaService,
  eliminarEtiquetaService
} from "../services/etiquetaProductoService.js";

export const mostrarEtiquetasController = async (req, res, next) => {
  try {
    const data = await mostrarEtiquetasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarEtiquetaController = async (req, res, next) => {
  try {
    const exito = await insertarEtiquetaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarEtiquetaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarEtiquetaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarEtiquetaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarEtiquetaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};