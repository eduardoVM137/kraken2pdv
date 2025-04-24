import {
  mostrarModuloEmpresasService,
  insertarModuloEmpresaService,
  editarModuloEmpresaService,
  eliminarModuloEmpresaService,
} from "../services/modulo_empresaService.js";

export const mostrarModuloEmpresasController = async (req, res, next) => {
  try {
    const data = await mostrarModuloEmpresasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarModuloEmpresaController = async (req, res, next) => {
  try {
    const exito = await insertarModuloEmpresaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarModuloEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarModuloEmpresaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarModuloEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarModuloEmpresaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};