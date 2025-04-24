import {
  mostrarContenedorInstanciasService,
  insertarContenedorInstanciaService,
  editarContenedorInstanciaService,
  eliminarContenedorInstanciaService,
} from "../services/contenedor_instanciaService.js";

export const mostrarContenedorInstanciasController = async (req, res, next) => {
  try {
    const data = await mostrarContenedorInstanciasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarContenedorInstanciaController = async (req, res, next) => {
  try {
    const exito = await insertarContenedorInstanciaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarContenedorInstanciaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarContenedorInstanciaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarContenedorInstanciaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarContenedorInstanciaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};