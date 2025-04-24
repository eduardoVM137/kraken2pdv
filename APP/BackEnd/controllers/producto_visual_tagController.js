import {
  mostrarProducto_visual_tagsService,
  insertarProducto_visual_tagService,
  editarProducto_visual_tagService,
  eliminarProducto_visual_tagService,
} from "../services/producto_visual_tagService.js";

export const mostrarProducto_visual_tagsController = async (req, res, next) => {
  try {
    const data = await mostrarProducto_visual_tagsService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarProducto_visual_tagController = async (req, res, next) => {
  try {
    const exito = await insertarProducto_visual_tagService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarProducto_visual_tagController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarProducto_visual_tagService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarProducto_visual_tagController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarProducto_visual_tagService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};