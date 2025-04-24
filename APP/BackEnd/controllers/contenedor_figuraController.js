import {
  mostrarContenedorFigurasService,
  insertarContenedorFiguraService,
  editarContenedorFiguraService,
  eliminarContenedorFiguraService,
} from "../services/contenedor_figuraService.js";

export const mostrarContenedorFigurasController = async (req, res, next) => {
  try {
    const data = await mostrarContenedorFigurasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarContenedorFiguraController = async (req, res, next) => {
  try {
    const exito = await insertarContenedorFiguraService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarContenedorFiguraController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarContenedorFiguraService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarContenedorFiguraController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarContenedorFiguraService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};