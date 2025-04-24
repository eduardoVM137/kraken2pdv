// controllers/clienteController.js
import {
    insertarClienteService,
    editarClienteService,
    eliminarClienteService,
    mostrarClientesService,
  } from '../services/clienteService.js';
  
  export const insertarClienteController = async (req, res, next) => {
    try {
      const resultado = await insertarClienteService(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  
  export const editarClienteController = async (req, res, next) => {
    try {
      const { idcliente, ...datos } = req.body;
      const resultado = await editarClienteService(idcliente, datos);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  
  export const eliminarClienteController = async (req, res, next) => {
    try {
      const { idcliente } = req.body;
      const resultado = await eliminarClienteService(idcliente);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  
  export const mostrarClientesController = async (req, res, next) => {
    try {
      const resultado = await mostrarClientesService();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };
  