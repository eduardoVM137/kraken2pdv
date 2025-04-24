import {
  mostrarProveedorsService,
  insertarProveedorService,
  editarProveedorService,
  eliminarProveedorService,
} from "../services/proveedorService.js";

export const mostrarProveedorsController = async (req, res, next) => {
  try {
    const data = await mostrarProveedorsService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarProveedorController = async (req, res, next) => {
  try {
    const exito = await insertarProveedorService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarProveedorController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarProveedorService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarProveedorController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarProveedorService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};