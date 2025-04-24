import {
  mostrarEmpresasService,
  insertarEmpresaService,
  editarEmpresaService,
  eliminarEmpresaService,
} from "../services/empresaService.js";

export const mostrarEmpresasController = async (req, res, next) => {
  try {
    const data = await mostrarEmpresasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarEmpresaController = async (req, res, next) => {
  try {
    const exito = await insertarEmpresaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarEmpresaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarEmpresaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};