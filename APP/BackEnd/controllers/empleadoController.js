import {
  mostrarEmpleadosService,
  insertarEmpleadoService,
  editarEmpleadoService,
  eliminarEmpleadoService,
} from "../services/empleadoService.js";

export const mostrarEmpleadosController = async (req, res, next) => {
  try {
    const data = await mostrarEmpleadosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarEmpleadoController = async (req, res, next) => {
  try {
    const exito = await insertarEmpleadoService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarEmpleadoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarEmpleadoService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarEmpleadoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarEmpleadoService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};