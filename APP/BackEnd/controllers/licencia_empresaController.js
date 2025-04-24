import {
  mostrarLicenciaEmpresasService,
  insertarLicenciaEmpresaService,
  editarLicenciaEmpresaService,
  eliminarLicenciaEmpresaService,
} from "../services/licencia_empresaService.js";

export const mostrarLicenciaEmpresasController = async (req, res, next) => {
  try {
    const data = await mostrarLicenciaEmpresasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarLicenciaEmpresaController = async (req, res, next) => {
  try {
    const exito = await insertarLicenciaEmpresaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarLicenciaEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarLicenciaEmpresaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarLicenciaEmpresaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarLicenciaEmpresaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};