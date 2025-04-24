import {
  mostrarTipoContenedorsService,
  insertarTipoContenedorService,
  editarTipoContenedorService,
  eliminarTipoContenedorService,
} from "../services/tipo_contenedorService.js";

export const mostrarTipoContenedorsController = async (req, res, next) => {
  try {
    const data = await mostrarTipoContenedorsService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarTipoContenedorController = async (req, res, next) => {
  try {
    const exito = await insertarTipoContenedorService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarTipoContenedorController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarTipoContenedorService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarTipoContenedorController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarTipoContenedorService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};