import {
  mostrarDetalleVentasService,
  insertarDetalleVentaService,
  editarDetalleVentaService,
  eliminarDetalleVentaService,
} from "../services/detalle_ventaService.js";

export const mostrarDetalleVentasController = async (req, res, next) => {
  try {
    const data = await mostrarDetalleVentasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarDetalleVentaController = async (req, res, next) => {
  try {
    const exito = await insertarDetalleVentaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarDetalleVentaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarDetalleVentaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarDetalleVentaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarDetalleVentaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};