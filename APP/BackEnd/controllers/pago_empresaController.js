import {
  mostrarPagoEmpresasService,
  insertarPagoEmpresaService,
  editarPagoEmpresaService,
  eliminarPagoEmpresaService,
} from "../services/pago_empresaService.js";

export const mostrarPagoEmpresasController = async (req, res, next) => {
  try {
    const data = await mostrarPagoEmpresasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarPagoEmpresaController = async (req, res, next) => {
  try {
    const exito = await insertarPagoEmpresaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarPagoEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarPagoEmpresaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarPagoEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarPagoEmpresaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};