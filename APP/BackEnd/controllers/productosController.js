import {
    insertarProductoService,
    editarProductoService,
    eliminarProductoService,
    mostrarProductosService,
    buscarProductoIdService,
    buscarProductoNombreDescripcionService,obtenerPreciosInventarios,getHistorialDetalleProducto  ,
  } from "../services/productoService.js";
  
  export const insertarProductoController = async (req, res, next) => {
    try {
      const exito = await insertarProductoService(req.body);
      if (!exito) return res.status(400).json({ message: "No se pudo crear el producto" });
  
      return res.status(201).json({ message: "Producto creado correctamente" });
    } catch (error) {
      next(error);
    }
  };
  
  export const editarProductoController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
  
      const exito = await editarProductoService(id, req.body);
      if (!exito) return res.status(404).json({ message: "Producto no encontrado" });
  
      return res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (error) {
      next(error);
    }
  };
  
  export const eliminarProductoController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
  
      const exito = await eliminarProductoService(id);
      if (!exito) return res.status(404).json({ message: "Producto no encontrado" });
  
      return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  };
  
  export const mostrarProductosController = async (req, res, next) => {
    try {
      const data = await mostrarProductosService();
      return res.status(200).json({ message: "Productos encontrados", data });
    } catch (error) {
      next(error);
    }
  };
  
  export const buscarProductoIdController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
  
      const producto = await buscarProductoIdService(id);
      if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
  
      return res.status(200).json({ data: producto });
    } catch (error) {
      next(error);
    }
  };
  
  export const buscarProductoNombreDescripcionController = async (req, res, next) => {
    try {
      const { busqueda } = req.query;
      if (!busqueda) return res.status(400).json({ message: "Se requiere un término de búsqueda" });
  
      const data = await buscarProductoNombreDescripcionService(busqueda);
      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };
  export async function getInventarioYPrecios(req, res) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Se requiere una lista válida de IDs de detalle_producto.",
      });
    }

    const data = await obtenerPreciosInventarios(ids);

    res.status(200).json({
      message: "Inventarios y precios obtenidos correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en getInventarioYPrecios:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}


export async function getMovimientosPrecio(req, res) {
  try {
    const detalleProductoId = parseInt(req.params.id);

    if (isNaN(detalleProductoId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const movimientos = await getHistorialDetalleProducto (detalleProductoId);

    res.status(200).json({
      message: "Movimientos de precio obtenidos correctamente",
      data: movimientos,
    });
  } catch (err) {
    console.error("Error en getMovimientosPrecio:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}