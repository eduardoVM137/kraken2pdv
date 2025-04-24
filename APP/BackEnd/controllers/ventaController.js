import {
  mostrarVentasService,
  insertarVentaService,
  editarVentaService,
  eliminarVentaService,
} from "../services/ventaService.js";

export const mostrarVentasController = async (req, res, next) => {
  try {
    const data = await mostrarVentasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarVentaController = async (req, res, next) => {
  try {
    const exito = await insertarVentaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarVentaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarVentaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarVentaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarVentaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};