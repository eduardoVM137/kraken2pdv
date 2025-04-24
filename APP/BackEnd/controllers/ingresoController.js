import {
  mostrarIngresosService,
  insertarIngresoService,
  editarIngresoService,
  eliminarIngresoService,
} from "../services/ingresoService.js";

export const mostrarIngresosController = async (req, res, next) => {
  try {
    const data = await mostrarIngresosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarIngresoController = async (req, res, next) => {
  try {
    const exito = await insertarIngresoService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarIngresoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarIngresoService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarIngresoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarIngresoService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};