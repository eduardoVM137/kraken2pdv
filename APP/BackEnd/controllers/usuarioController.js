// src/controllers/usuarioController.js
import {
  mostrarUsuariosService,
  insertarUsuarioService,
  editarUsuarioService,
  eliminarUsuarioService,
} from "../services/usuarioService.js";

export const mostrarUsuariosController = async (req, res, next) => {
  try {
    const data = await mostrarUsuariosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarUsuarioController = async (req, res, next) => {
  try {
    const exito = await insertarUsuarioService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarUsuarioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarUsuarioService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarUsuarioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarUsuarioService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};
