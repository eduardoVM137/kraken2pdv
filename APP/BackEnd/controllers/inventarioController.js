import {
  mostrarInventariosService,
  insertarInventarioService,
  editarInventarioService,
  eliminarInventarioService,
} from "../services/inventarioService.js";

export const mostrarInventariosController = async (req, res, next) => {
  try {
    const data = await mostrarInventariosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarInventarioController = async (req, res, next) => {
  try {
    const exito = await insertarInventarioService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarInventarioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarInventarioService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarInventarioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarInventarioService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};