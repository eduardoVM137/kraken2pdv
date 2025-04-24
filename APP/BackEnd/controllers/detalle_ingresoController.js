import {
  mostrarDetalleIngresosService,
  insertarDetalleIngresoService,
  editarDetalleIngresoService,
  eliminarDetalleIngresoService,
} from "../services/detalle_ingresoService.js";

export const mostrarDetalleIngresosController = async (req, res, next) => {
  try {
    const data = await mostrarDetalleIngresosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarDetalleIngresoController = async (req, res, next) => {
  try {
    const exito = await insertarDetalleIngresoService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarDetalleIngresoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarDetalleIngresoService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarDetalleIngresoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarDetalleIngresoService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};