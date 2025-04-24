import {
  mostrarUbicacion_fisicasService,
  insertarUbicacion_fisicaService,
  editarUbicacion_fisicaService,
  eliminarUbicacion_fisicaService,
} from "../services/ubicacion_fisicaService.js";

export const mostrarUbicacion_fisicasController = async (req, res, next) => {
  try {
    const data = await mostrarUbicacion_fisicasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarUbicacion_fisicaController = async (req, res, next) => {
  try {
    const exito = await insertarUbicacion_fisicaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarUbicacion_fisicaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarUbicacion_fisicaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarUbicacion_fisicaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarUbicacion_fisicaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};