import {
    insertarDetalleProductoService,
    editarDetalleProductoService,
    eliminarDetalleProductoService,
    mostrarDetalleProductosService,
    buscarDetalleProductoIdService,
  } from "../services/detalle_Producto_Service.js";
  
  export const insertarDetalleProductoController = async (req, res, next) => {
    try {
      const exito = await insertarDetalleProductoService(req.body);
      return exito
        ? res.status(201).json({ message: "Detalle producto creado" })
        : res.status(400).json({ message: "No se pudo crear" });
    } catch (error) {
      next(error);
    }
  };
  
  export const editarDetalleProductoController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
  
      const exito = await editarDetalleProductoService(id, req.body);
      return exito
        ? res.status(200).json({ message: "Actualizado" })
        : res.status(404).json({ message: "No encontrado" });
    } catch (error) {
      next(error);
    }
  };
  
  export const eliminarDetalleProductoController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const exito = await eliminarDetalleProductoService(id);
      return exito
        ? res.status(200).json({ message: "Eliminado" })
        : res.status(404).json({ message: "No encontrado" });
    } catch (error) {
      next(error);
    }
  };
  
  export const mostrarDetalleProductosController = async (req, res, next) => {
    try {
      const datos = await mostrarDetalleProductosService();
      res.status(200).json({ data: datos });
    } catch (error) {
      next(error);
    }
  };
  
  export const buscarDetalleProductoIdController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const detalle = await buscarDetalleProductoIdService(id);
      return detalle
        ? res.status(200).json({ data: detalle })
        : res.status(404).json({ message: "No encontrado" });
    } catch (error) {
      next(error);
    }
  };
  