import {
  mostrarVentasService,
  insertarVentaService,
  editarVentaService,
  eliminarVentaService,
  obtenerProductosVentaCompacto,obtenerPresentacionesPorProducto,buscarProductosPorAliasService,
} from "../services/ventaService.js";


 
 export const mostrarProductosVentaController = async (req, res, next) => {
  try {
    const [registros, presentaciones] = await Promise.all([
      obtenerProductosVentaCompacto(),
      obtenerPresentacionesPorProducto(),
    ]);

    const productosMap = new Map();

    for (const row of registros) {
      const {
        detalle_producto_id,
        nombre_calculado,
        foto,
        stock_actual,
        precio_id,
        presentacion_id,
        tipo_cliente,
        precio_venta,
      } = row;

      if (!productosMap.has(detalle_producto_id)) {
        productosMap.set(detalle_producto_id, {
          detalle_producto_id,
          nombre_calculado,
          fotos: foto ? [foto] : [],
          stock_total: 0,
          precios: [],
          presentaciones: [],
        });
      }

      const prod = productosMap.get(detalle_producto_id);

      // Agregar foto si no está repetida
      if (foto && !prod.fotos.includes(foto)) {
        prod.fotos.push(foto);
      }

      // Agregar stock
      prod.stock_total += Number(stock_actual ?? 0);

      // Agregar precio si no está duplicado por ID
      if (!prod.precios.some(p => p.precio_id === precio_id)) {
        prod.precios.push({ precio_id, presentacion_id, tipo_cliente, precio_venta });
      }
    }

    for (const pres of presentaciones) {
      const prod = productosMap.get(pres.detalle_producto_id);
      if (prod && !prod.presentaciones.some(p => p.presentacion_id === pres.id)) {
        prod.presentaciones.push({
          presentacion_id: pres.id,
          nombre_presentacion: pres.nombre,
          cantidad_presentacion: Number(pres.cantidad ?? 0),
        });
      }
    }

    res.status(200).json({ data: Array.from(productosMap.values()) });
  } catch (error) {
    next(error);
  }
};






export const mostrarVentasController = async (req, res, next) => {
  try {
    const data = await mostrarVentasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};




export const insertarVentaController = async (req, res, next) => {
  try {
    const exito = await insertarVentaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarVentaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarVentaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarVentaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarVentaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};
//busqueda en panel ventas



export const buscarProductosPorAliasController = async (req, res, next) => {
  try {
    const busqueda = req.query.busqueda?.trim();
    if (!busqueda) {
      return res.status(400).json({ error: "Parámetro 'busqueda' requerido" });
    }

    const [registros, presentaciones] = await Promise.all([
      buscarProductosPorAliasService(busqueda),
      obtenerPresentacionesPorProducto(),
    ]);

    const productosMap = new Map();

    for (const row of registros) {
      const {
        detalle_producto_id,
        nombre_calculado,
        foto,
        stock_actual,
        precio_id,
        presentacion_id,
        tipo_cliente,
        precio_venta,
      } = row;

      if (!productosMap.has(detalle_producto_id)) {
        productosMap.set(detalle_producto_id, {
          detalle_producto_id,
          nombre_calculado,
          fotos: foto ? [foto] : [],
          stock_total: 0,
          precios: [],
          presentaciones: [],
        });
      }

      const prod = productosMap.get(detalle_producto_id);

      if (foto && !prod.fotos.includes(foto)) {
        prod.fotos.push(foto);
      }

      prod.stock_total += Number(stock_actual ?? 0);

      if (!prod.precios.some(p => p.precio_id === precio_id)) {
        prod.precios.push({
          precio_id,
          presentacion_id,
          tipo_cliente,
          precio_venta,
        });
      }
    }

    for (const pres of presentaciones) {
      const prod = productosMap.get(pres.detalle_producto_id);
      if (prod && !prod.presentaciones.some(p => p.presentacion_id === pres.id)) {
        prod.presentaciones.push({
          presentacion_id: pres.id,
          nombre_presentacion: pres.nombre,
          cantidad_presentacion: Number(pres.cantidad ?? 0),
        });
      }
    }

    res.status(200).json({ data: Array.from(productosMap.values()) });
  } catch (error) {
    next(error);
  }
};