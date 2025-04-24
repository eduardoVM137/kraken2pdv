
import {
  insertarComponenteService,
  editarComponenteService,
  eliminarComponenteService,
  mostrarComponentesService,
} from '../services/componenteService.js';

export const insertarComponenteController = async (req, res, next) => {
  try {
    const { idproducto, idproducto_item, cantidad } = req.body;
    const resultado = await insertarComponenteService(idproducto, idproducto_item, cantidad);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const editarComponenteController = async (req, res, next) => {
  try {
    const { idcomponente, idproducto, idproducto_item, cantidad } = req.body;
    const resultado = await editarComponenteService(idcomponente, idproducto, idproducto_item, cantidad);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarComponenteController = async (req, res, next) => {
  try {
    const { idcomponente } = req.body;
    const resultado = await eliminarComponenteService(idcomponente);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const mostrarComponentesController = async (req, res, next) => {
  try {
    const resultado = await mostrarComponentesService();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
