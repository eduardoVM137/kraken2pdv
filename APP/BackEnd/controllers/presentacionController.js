import {
  mostrarPresentacionesService,
  insertarPresentacionService,
  editarPresentacionService,
  eliminarPresentacionService,
  buscarPresentacionPorIdService,buscarPresentacionesPorDetalleProductoService
} from "../services/presentacionService.js";

export const mostrarPresentacionesController = async (req, res, next) => {
  try {
    const data = await mostrarPresentacionesService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarPresentacionController = async (req, res, next) => {
  try {
    const exito = await insertarPresentacionService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarPresentacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarPresentacionService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarPresentacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarPresentacionService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

 
// Buscar por ID
export const buscarPresentacionPorIdContoller = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const data = await buscarPresentacionPorIdService(id);
    if (!data) return res.status(404).json({ message: "Detalle producto no encontrado" });

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las presentaciones por detalle_producto_id
 
export const buscarPresentacionesPorDetalleProductoController = async (req, res, next) => {
  try {
    const detalle_producto_id = Number(req.params.detalle_producto_id);
    if (isNaN(detalle_producto_id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const data = await buscarPresentacionesPorDetalleProductoService(detalle_producto_id);
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error al buscar presentaciones por detalle_producto_id:", error);
    next(error);
  }
};
