import {
  mostrarVentasService,
  insertarVentaService,
  editarVentaService,
  eliminarVentaService,
  obtenerProductosVentaCompacto,obtenerPresentacionesPorProducto,buscarProductosPorAliasService,
  crearVentaService,buscarVentasService,estadoVentaService,buscarVentaService
} from "../services/ventaService.js";


  export const mostrarProductosVentaController = async (req, res, next) => {
  try {
    const [registros, presentaciones] = await Promise.all([
      obtenerProductosVentaCompacto(),
      obtenerPresentacionesPorProducto(),
    ]);

    const productosMap = new Map();

    // 1) Agrupar por detalle_producto_id
    for (const row of registros) {
      const {
        detalle_producto_id,
        nombre_calculado,
        foto,
        inventario_id,
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
          inventarios: [],    // <- sin 'as'
          stock_total: 0,
          precios: [],         // <- sin 'as'
          presentaciones: [],  // <- sin 'as'
        });
      }

      const prod = productosMap.get(detalle_producto_id);

      // Fotos (evitar duplicados)
      if (foto && !prod.fotos.includes(foto)) {
        prod.fotos.push(foto);
      }

      // Sumar al stock total
      prod.stock_total += Number(stock_actual ?? 0);

      // Agregar precio único
      if (!prod.precios.some(p => p.precio_id === precio_id)) {
        prod.precios.push({ precio_id, presentacion_id, tipo_cliente, precio_venta });
      }

      // Agregar inventario único
      if (!prod.inventarios.some(inv => inv.id === inventario_id)) {
        prod.inventarios.push({ id: inventario_id, stock: Number(stock_actual ?? 0) });
      }
    }

    // 2) Añadir presentaciones
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

    // 3) Ordenar inventarios por stock y dejar solo los IDs
    const productos = Array.from(productosMap.values()).map(prod => {
      prod.inventarios = prod.inventarios
        .sort((a, b) => b.stock - a.stock)
        .map(inv => inv.id);
      return prod;
    });

    res.status(200).json({ data: productos });
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
export const buscarVentasController = async (req, res, next) => {
  try {
    const ventaId = Number(req.params.id);
    if (Number.isNaN(ventaId)) {
      return res.status(400).json({ message: "ID de venta inválido" });
    }

    const detalles = await buscarVentasService(ventaId);

    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada o sin detalles" });
    }

    res.status(200).json({ data: detalles });
  } catch (error) {
    next(error);
  }
};

export const buscarVentaController = async (req, res, next) => {
  try {
    const ventaId = Number(req.params.id);
    if (Number.isNaN(ventaId)) {
      return res.status(400).json({ message: "ID de venta inválido" });
    }

    const detalles = await buscarVentaService(ventaId);

    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada o sin detalles" });
    }

    res.status(200).json({ data: detalles });
  } catch (error) {
    next(error);
  }
};

export const insertarVentaController = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);

    const nuevaVenta = await crearVentaService(req.body);
    res.status(201).json({ data: nuevaVenta });
  } catch (err) {
    next(err);
  }
};



export const estadoVentasController = async (req, res, next) => {
  try {
    const payload = req.body;
    const resultado = await estadoVentaService(payload);
    res.status(200).json({ data: resultado });
  } catch (err) {
    next(err);
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
    
// 4) Obtener inventarios por detalle_producto_id
const inventariosMap = new Map();
for (const row of registros) {
  const { detalle_producto_id, inventario_id, stock_actual } = row;
  if (!inventariosMap.has(detalle_producto_id)) {
    inventariosMap.set(detalle_producto_id, []);
  }
  if (!inventariosMap.get(detalle_producto_id).some(i => i.id === inventario_id)) {
    inventariosMap.get(detalle_producto_id).push({ id: inventario_id, stock: Number(stock_actual ?? 0) });
  }
}

// 5) Asignar inventarios ordenados
for (const [id, invs] of inventariosMap.entries()) {
  const prod = productosMap.get(id);
  if (prod) {
    prod.inventarios = invs
      .sort((a, b) => b.stock - a.stock)
      .map(inv => inv.id); // solo IDs como en la otra API
  }
}

    res.status(200).json({ data: Array.from(productosMap.values()) });
  } catch (error) {
    next(error);
  }
};

//ventas