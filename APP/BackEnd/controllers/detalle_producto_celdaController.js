import {
  mostrarDetalleProductoCeldasService,
  insertarDetalleProductoCeldaService,
  editarDetalleProductoCeldaService,
  eliminarDetalleProductoCeldaService,
} from "../services/detalle_producto_celdaService.js";

export const mostrarDetalleProductoCeldasController = async (req, res, next) => {
  try {
    const data = await mostrarDetalleProductoCeldasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarDetalleProductoCeldaController = async (req, res, next) => {
  try {
    const exito = await insertarDetalleProductoCeldaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarDetalleProductoCeldaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarDetalleProductoCeldaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarDetalleProductoCeldaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarDetalleProductoCeldaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};