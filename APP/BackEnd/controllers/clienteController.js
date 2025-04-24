import {
  mostrarClientesService,
  insertarClienteService,
  editarClienteService,
  eliminarClienteService,
} from "../services/clienteService.js";

export const mostrarClientesController = async (req, res, next) => {
  try {
    const data = await mostrarClientesService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarClienteController = async (req, res, next) => {
  try {
    const exito = await insertarClienteService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarClienteController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarClienteService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarClienteController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarClienteService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};