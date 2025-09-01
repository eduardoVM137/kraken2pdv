import {
  mostrarContenedorFisicosService,
  insertarContenedorFisicoService,
  editarContenedorFisicoService,
  eliminarContenedorFisicoService,
} from "../services/contenedor_fisicoService.js";

export const mostrarContenedorFisicosController = async (req, res, next) => {
  try {
    const data = await mostrarContenedorFisicosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};



export const insertarContenedorFisicoController = async (req, res, next) => {
  try {
    const exito = await insertarContenedorFisicoService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarContenedorFisicoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarContenedorFisicoService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarContenedorFisicoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarContenedorFisicoService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};