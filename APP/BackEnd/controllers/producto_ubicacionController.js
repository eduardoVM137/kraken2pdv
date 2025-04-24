import {
  mostrarProductoUbicacionsService,
  insertarProductoUbicacionService,
  editarProductoUbicacionService,
  eliminarProductoUbicacionService,
} from "../services/producto_ubicacionService.js";

export const mostrarProductoUbicacionsController = async (req, res, next) => {
  try {
    const data = await mostrarProductoUbicacionsService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarProductoUbicacionController = async (req, res, next) => {
  try {
    const exito = await insertarProductoUbicacionService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarProductoUbicacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarProductoUbicacionService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarProductoUbicacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarProductoUbicacionService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};