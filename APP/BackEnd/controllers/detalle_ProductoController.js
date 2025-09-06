import { db } from "../config/database.js";

//insertar detalle producto con transaccion
import {
  insertarDetalleProductoServiceTx,
  editarDetalleProductoService,
  eliminarDetalleProductoService,
  mostrarDetalleProductosService,
  buscarDetalleProductoIdService,
  getDetalleProductoById ,
  eliminarRelacionesDetalleProductoTx,editarDetalleProductoServiceTx,
} from "../services/detalle_ProductoService.js";
import { insertarMovimientoStockServiceTx } from "../services/movimientoStockService.js";
import { insertarStateServiceTx } from "../services/stateService.js"; 
import {
  insertarAtributoServiceTx,
  insertarDetalleAtributosServiceTx
} from "../services/atributoService.js";
//imports para buscar prductos con su id ;
import { insertarPrecioDesdeMovimientoTx,buscarPreciosPorDetalleProductoService } from "../services/precioService.js";
import { insertarProductoUbicacionDesdeMovimientoTx,buscarUbicacionesPorDetalleProductoService } from "../services/producto_ubicacionService.js";
import { insertarAliasProductoTx,buscarAliasPorCodigoService } from '../services/etiquetaProductoService.js';
import { insertarMultimediaProductoTx,buscarFotosPorDetalleProductoService } from '../services/productoMultimediaService.js';

import { buscarAtributoPorIdService } from '../services/atributoService.js';
import { buscarDetallesAtributoService } from '../services/detalleAtributoService.js';
import { buscarAliasPorDetalleProductoService } from '../services/etiquetaProductoService.js';
import { buscarPreciosPorIdService } from '../services/precioService.js';
import { buscarInventariosPorIdService,buscarUltimoPrecioCostoService,insertarInventarioDesdeMovimientoTx,buscarInventarioPorDetalleProductoService } from '../services/inventarioService.js';
 
import { buscarComponentesPorDetalleProductoService } from '../services/componenteService.js';
import { buscarDetalleProductoCeldaPorDetalleProductoService } from '../services/detalle_producto_celdaService.js';

import { insertarPresentacionServiceTx ,buscarPresentacionPorIdService} from '../services/presentacionService.js'; // <<-- Asegúrate de tener este service creado.

import { insertarComponenteProductoTx } from '../services/componenteService.js'; // <<-- Asegúrate de tener este service creado.
 
import { insertarDetalleProductoCeldaTx } from '../services/detalle_producto_celdaService.js'; // <<-- Asegúrate de tener este service creado.
   

 // Procesa presentaciones y etiquetas asociadas a un detalle_producto
const procesarPresentacionesYAlias = async (tx, presentaciones, etiquetas, detalleId) => {
  const mapaVirtual = {};

  try {
    if (presentaciones.length > 0) {
      for (const pres of presentaciones) {
        const nueva = await insertarPresentacionServiceTx(tx, {
          detalle_producto_id: detalleId,
          nombre: pres.nombre,
          cantidad: pres.cantidad,
          descripcion: pres.descripcion ?? null,
        });

        if (!nueva?.id) {
          throw new Error("No se pudo insertar la presentación");
        }

        if (pres.idVirtualPresentacion) {
          mapaVirtual[pres.idVirtualPresentacion] = nueva.id;
        }
      }
    }

    if (etiquetas.length > 0) {
      for (const etiqueta of etiquetas) {
        let presentacionId = etiqueta.presentacion_id || null;

        if (etiqueta.idVirtualPresentacion) {
          presentacionId = mapaVirtual[etiqueta.idVirtualPresentacion] || null;
        }

        const res = await insertarAliasProductoTx(tx, [{
          detalle_producto_id: detalleId,
          tipo: etiqueta.tipo,
          alias: etiqueta.alias,
          visible: etiqueta.visible ?? true,
          presentacion_id: presentacionId
        }]);

        if (!res) {
          throw new Error("No se pudo insertar el alias del producto");
        }
      }
    }

    return mapaVirtual;
  } catch (error) {
    throw error;
  }
};

// Procesa la inserción de inventarios asociados a un detalle_producto
const procesarInventarios = async (tx, inventarios, detalle, state, req) => {
  const map = {};
  try {
    for (const inv of inventarios) {
      const movimiento = await insertarMovimientoStockServiceTx(tx, {
        empresa_id: req.empresa_id || 1,
        producto_id: detalle.producto_id,
        detalle_producto_id: detalle.id,
        ubicacion_id: 1,//si pongo uno si funciona pero debe ser inv.ubicacion_fisica_id y tengo q actualiar precio apra q jale(solo precio al parecer)
        cantidad: inv.stock_actual,
        precio_costo: inv.precio_costo,
        tipo_movimiento: 'ajuste_inicial',
        motivo: 'Alta inventario',
        usuario_id: req.usuario_id || null,
      });

      if (!movimiento?.id) throw new Error("No se pudo registrar movimiento_stock para inventario");

      const inventarioInsertado = await insertarInventarioDesdeMovimientoTx(tx, {
        detalle_producto_id: detalle.id,
        stock_actual: inv.stock_actual,
        stock_minimo: inv.stock_minimo,
        precio_costo: inv.precio_costo,
        ubicacion_fisica_id: inv.ubicacion_fisica_id,
        proveedor_id: inv.proveedor_id,
        state_id: state.id,
      });

      if (!inventarioInsertado?.id) throw new Error("No se pudo insertar el inventario");

      if (Array.isArray(inv.celdas) && inv.celdas.length > 0) {
        const lista = inv.celdas.map(celda => ({
          detalle_producto_id: detalle.id,
          inventario_id: inventarioInsertado.id,
          celda_id: celda.celda_id,
          contenedor_fisico_id: celda.contenedor_fisico_id,
          cantidad: celda.cantidad,
        }));
        const celdaRes = await insertarDetalleProductoCeldaTx(tx, lista);

        if (!celdaRes) throw new Error("No se pudo insertar detalle_producto_celda");
      }

      if (inv.idVirtual) {
        map[inv.idVirtual] = inventarioInsertado.id;
      }
    }
    return map;
  } catch (error) {
    throw error;
  }
};

// Procesa los precios asociados al detalle_producto y presentaciones
const procesarPrecios = async (tx, precios, detalle, mapaVirtual) => {
  const map = {};
  try {
    for (const p of precios) {
      let presentacion_id = p.presentacion_id || null;
      if (p.idVirtualPresentacion) {
        presentacion_id = mapaVirtual[p.idVirtualPresentacion] || null;
      }

      const precio = await insertarPrecioDesdeMovimientoTx(tx, {
        ...p,
        detalle_producto_id: detalle.id,
        presentacion_id, 
        vigente: p.vigente ?? true, 
        fecha_inicio: p.fecha_inicio ? new Date(p.fecha_inicio) : null,
        fecha_fin: p.fecha_fin ? new Date(p.fecha_fin) : null,
      });

      if (!precio?.id) throw new Error("No se pudo insertar el precio del producto");

      if (p.idVirtual) {
        map[p.idVirtual] = precio.id;
      }
    }
    return map;
  } catch (error) {
    throw error;
  }
};

// Procesa y vincula ubicaciones lógicas de un producto
const procesarProductoUbicacionFlexible = async (tx, ubicaciones, detalle_producto_id, inventarioMap, precioMap, req) => {
  try {
    for (const item of ubicaciones) {
      const { idVirtualInventario, idVirtualPrecio, ubicacion_fisica_id, negocio_id, compartir } = item;

      if (!ubicacion_fisica_id || !negocio_id) {
        throw new Error("Cada producto_ubicacion debe incluir ubicacion_fisica_id y negocio_id");
      }

      const inventario_id = idVirtualInventario ? inventarioMap[idVirtualInventario] : null;
      const precio_id = idVirtualPrecio ? precioMap[idVirtualPrecio] : null;

      const inserted = await insertarProductoUbicacionDesdeMovimientoTx(tx, {
        detalle_producto_id,
        inventario_id,
        precio_id,
        ubicacion_fisica_id,
        negocio_id,
        compartir: compartir === true,
      });

      if (!inserted) throw new Error("No se pudo insertar producto_ubicacion");
    }
  } catch (error) {
    throw error;
  }
};

// Procesa archivos multimedia asociados al detalle_producto
const procesarMultimedia = async (tx, fotos, detalleId) => {
  try {
    if (fotos.length > 0) {
      const multimedia = fotos.map(f => ({
        detalle_producto_id: detalleId,
        url_archivo: f
      }));

      const inserted = await insertarMultimediaProductoTx(tx, multimedia);

      if (!inserted) throw new Error("No se pudo insertar archivos multimedia");
    }
  } catch (error) {
    throw error;
  }
};

// Controlador principal para insertar detalle_producto y sus relaciones
export const insertarDetalleProductoController = async (req, res, next) => {
  try {
    const {
      atributo = {},
      detalles_atributo = [],
      componentes = [],
      presentaciones = [],
      etiquetas = [],
      inventarios = [],
      precios = [],
      producto_ubicaciones = [],
      fotos = [],
      ...resto
    } = req.body;

    if (!Array.isArray(producto_ubicaciones) || producto_ubicaciones.length === 0) {
      return res.status(400).json({ message: "Se requiere al menos un producto_ubicacion con negocio_id, ubicacion_fisica_id y detalle_producto_id" });
    }

    const resultado = await db.transaction(async (tx) => {
      const state = await insertarStateServiceTx(tx, { tabla_afectada: "detalle_producto" });
      if (!state?.id) throw new Error("No se pudo crear el estado");

      let atributo_id = null;
      if (atributo?.nombre) {
        const atributoInsertado = await insertarAtributoServiceTx(tx, atributo);
        if (!atributoInsertado?.id) throw new Error("No se pudo insertar atributo");
        atributo_id = atributoInsertado.id;

        if (detalles_atributo.length > 0) {
          const detalles = detalles_atributo.map(det => ({ ...det, id_atributo: atributo_id }));
          await insertarDetalleAtributosServiceTx(tx, detalles);
        }
      }

      const detalle = await insertarDetalleProductoServiceTx(tx, {
        ...resto,
        atributo_id,
        state_id: state.id,
      });

      if (!detalle?.id) throw new Error("No se pudo insertar el detalle_producto");

      if (componentes.length > 0) {
        const lista = componentes.map(c => ({
          detalle_producto_hijo_id: detalle.id,
          detalle_producto_padre_id: c.detalle_producto_padre_id,
          cantidad: c.cantidad,
        }));
        await insertarComponenteProductoTx(tx, lista);
      }

      const mapaVirtual = await procesarPresentacionesYAlias(tx, presentaciones, etiquetas, detalle.id);
      const inventarioMap = await procesarInventarios(tx, inventarios, detalle, state, req);
      const precioMap = await procesarPrecios(tx, precios, detalle, mapaVirtual);
      await procesarProductoUbicacionFlexible(tx, producto_ubicaciones, detalle.id, inventarioMap, precioMap, req);
      await procesarMultimedia(tx, fotos, detalle.id);

      return detalle;
    });

    return res.status(201).json({ message: "Detalle producto creado correctamente", data: resultado });
  } catch (error) {
    console.error("Error en transacción de detalle_producto:", error);
    next(error);
  }
};




export const editarDetalleProductoController = async (req, res, next) => {
  try {
    const detalleId = parseInt(req.params.id);
    if (isNaN(detalleId)) return res.status(400).json({ message: "ID inválido" });

    const {
      atributo = {},
      detalles_atributo = [],
      componentes = [],
      presentaciones = [],
      etiquetas = [],
      inventarios = [],
      precios = [],
      producto_ubicaciones = [],
      fotos = [],
      ...resto
    } = req.body;

    const resultado = await db.transaction(async (tx) => {
      // Eliminar datos previos relacionados
      await eliminarRelacionesDetalleProductoTx(tx, detalleId);

      // Reinsertar estado (opcional: podrías también actualizar el existente si lo deseas)
      const state = await insertarStateServiceTx(tx, { tabla_afectada: "detalle_producto" });
      if (!state?.id) throw new Error("No se pudo crear el nuevo estado");

      // Actualizar o insertar atributo
      let atributo_id = null;
      if (atributo?.nombre) {
        const atributoInsertado = await insertarAtributoServiceTx(tx, atributo);
        if (!atributoInsertado?.id) throw new Error("No se pudo actualizar/insetar atributo");
        atributo_id = atributoInsertado.id;

        if (detalles_atributo.length > 0) {
          const detalles = detalles_atributo.map(det => ({ ...det, id_atributo: atributo_id }));
          await insertarDetalleAtributosServiceTx(tx, detalles);
        }
      }

      // Actualizar el detalle_producto
      const detalle = await editarDetalleProductoServiceTx(tx, {
        ...resto,
        id: detalleId,
        atributo_id,
        state_id: state.id,
      });

      if (!detalle?.id) throw new Error("No se pudo actualizar el detalle_producto");

      // Insertar nuevos componentes
      if (componentes.length > 0) {
        const lista = componentes.map(c => ({
          detalle_producto_hijo_id: detalle.id,
          detalle_producto_padre_id: c.detalle_producto_padre_id,
          cantidad: c.cantidad,
        }));
        await insertarComponenteProductoTx(tx, lista);
      }

      const mapaVirtual = await procesarPresentacionesYAlias(tx, presentaciones, etiquetas, detalle.id);
      const inventarioMap = await procesarInventarios(tx, inventarios, detalle, state, req);
      const precioMap = await procesarPrecios(tx, precios, detalle, mapaVirtual);
      await procesarProductoUbicacionFlexible(tx, producto_ubicaciones, detalle.id, inventarioMap, precioMap, req);
      await procesarMultimedia(tx, fotos, detalle.id);

      return detalle;
    });

    return res.status(200).json({ message: "Detalle producto actualizado correctamente", data: resultado });
  } catch (error) {
    console.error("Error al editar detalle_producto:", error);
    next(error);
  }
};



export const editar1DetalleProductoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const existente = await buscarDetalleProductoIdService(id);
    if (!existente) return res.status(404).json({ message: "Detalle producto no encontrado" });

    const {
      atributo,
      detalles_atributo = [],
      fotos = [],
      etiquetas = [],
      presentaciones = [],
      nombre_calculado,
      descripcion,
      medida,
      unidad_medida,
      marca_id,
      activo
    } = req.body;

    const resultado = await db.transaction(async (tx) => {
      // 1. Actualizar detalle_producto
      const actualizado = await editarDetalleProductoService(id, {
        nombre_calculado,
        descripcion,
        medida,
        unidad_medida,
        marca_id,
        activo
      });

      if (!actualizado) throw new Error("No se pudo actualizar el detalle_producto");

      // 2. Actualizar atributo y detalles si vienen
      if (atributo?.nombre) {
        const atributoExistente = existente.atributo_id
          ? await buscarAtributoPorIdService(existente.atributo_id)
          : null;

        let atributo_id = existente.atributo_id;

        if (atributoExistente) {
          await tx.update(schema.Atributo)
            .set({ nombre: atributo.nombre })
            .where(eq(schema.Atributo.id, existente.atributo_id));
        } else {
          const nuevo = await insertarAtributoServiceTx(tx, atributo);
          atributo_id = nuevo.id;
          await tx.update(schema.DetalleProducto)
            .set({ atributo_id: atributo_id })
            .where(eq(schema.DetalleProducto.id, id));
        }

        // Reemplazar detalles_atributo
        await tx.delete(schema.DetalleAtributo)
          .where(eq(schema.DetalleAtributo.id_atributo, atributo_id));

        if (detalles_atributo.length > 0) {
          const nuevos = detalles_atributo.map(d => ({
            id_atributo: atributo_id,
            valor: d.valor
          }));
          await insertarDetalleAtributosServiceTx(tx, nuevos);
        }
      }

      // 3. Reemplazar etiquetas (alias)
      if (Array.isArray(etiquetas)) {
        await tx.delete(schema.EtiquetaProducto).where(eq(schema.EtiquetaProducto.detalle_producto_id, id));
        if (etiquetas.length > 0) {
          const etiquetasFormateadas = etiquetas.map(e => ({
            detalle_producto_id: id,
            tipo: e.tipo,
            alias: e.alias,
            presentacion_id: e.presentacion_id ?? null,
            visible: e.visible ?? true
          }));
          await insertarAliasProductoTx(tx, etiquetasFormateadas);
        }
      }

      // 4. Reemplazar fotos
      if (Array.isArray(fotos)) {
        await tx.delete(schema.ProductoMultimedia).where(eq(schema.ProductoMultimedia.detalle_producto_id, id));
        if (fotos.length > 0) {
          const nuevas = fotos.map(url => ({
            detalle_producto_id: id,
            url_archivo: url
          }));
          await insertarMultimediaProductoTx(tx, nuevas);
        }
      }

      // 5. Reemplazar presentaciones
      if (Array.isArray(presentaciones)) {
        await tx.delete(schema.Presentacion).where(eq(schema.Presentacion.detalle_producto_id, id));
        if (presentaciones.length > 0) {
          for (const p of presentaciones) {
            await insertarPresentacionServiceTx(tx, {
              detalle_producto_id: id,
              nombre: p.nombre,
              cantidad: p.cantidad,
              descripcion: p.descripcion
            });
          }
        }
      }

      return actualizado;
    });

    return res.status(200).json({ message: "Detalle producto actualizado", data: resultado });
  } catch (error) {
    console.error("Error al editar detalle_producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};





// Eliminar
export const eliminarDetalleProductoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const success = await eliminarDetalleProductoService(id);
    if (!success) return res.status(404).json({ message: "Detalle producto no encontrado" });

    res.status(200).json({ message: "Detalle producto eliminado" });
  } catch (error) {
    next(error);
  }
};

// Mostrar todos
export const mostrarDetalleProductosController = async (req, res, next) => {
  try {
    const data = await mostrarDetalleProductosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Buscar por ID
export const buscarDetalleProductoIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const data = await buscarDetalleProductoIdService(id);
    if (!data) return res.status(404).json({ message: "Detalle producto no encontrado" });

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};


export const buscarDetalleProductoCompletoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const detalle = await buscarDetalleProductoIdService(id);
    if (!detalle) return res.status(404).json({ message: "Detalle producto no encontrado" });

    // Relaciones
    const atributo = detalle.atributo_id ? await buscarAtributoPorIdService(detalle.atributo_id) : null;
    const detalles_atributo = atributo ? await buscarDetallesAtributoService(atributo.id) : [];
    const etiqueta_producto = await buscarAliasPorDetalleProductoService(id);
    const fotos = await buscarFotosPorDetalleProductoService(id);
    const producto_ubicaciones = await buscarUbicacionesPorDetalleProductoService(id); 
    const celdas = await buscarDetalleProductoCeldaPorDetalleProductoService(id);
    const componentes = await buscarComponentesPorDetalleProductoService(id);

    const celdasPorInventario = {};
    for (const c of celdas) {
      if (!celdasPorInventario[c.inventario_id]) {
        celdasPorInventario[c.inventario_id] = [];
      }
      celdasPorInventario[c.inventario_id].push(c);
    }
    // Recoger ids únicos de las producto_ubicaciones (no vienen del usuario, sino de BD)
    const precioIds = producto_ubicaciones.map(u => u.precio_id).filter(Boolean);
    const inventarioIds = producto_ubicaciones.map(u => u.inventario_id).filter(Boolean);

    // Traer solo los necesarios
    const precios = await buscarPreciosPorIdService(precioIds);
    const inventarios = await buscarInventariosPorIdService(inventarioIds);

    // Construcción final
    const resultado = {
      detalle_producto: {
        id: detalle.id,
        producto_id: detalle.producto_id,
        marca_id: detalle.marca_id,
        medida: detalle.medida,
        unidad_medida: detalle.unidad_medida,
        descripcion: detalle.descripcion,
        nombre_calculado: detalle.nombre_calculado,
        activo: detalle.activo,
        state_id: detalle.state_id
      },
      atributo: atributo ? {
        id: atributo.id,
        nombre: atributo.nombre
      } : null,
      detalles_atributo,
      etiqueta_producto,
      fotos,
      producto_ubicaciones: producto_ubicaciones.map(u => ({
        ...u,
        precio: precios.find(p => p.id === u.precio_id) || null,
        inventario: inventarios.find(i => i.id === u.inventario_id) || null,
        celdas: celdasPorInventario[u.inventario_id] || []
      })),
      componentes  
    };

    return res.status(200).json({ data: resultado });
  } catch (error) {
    console.error("Error al buscar detalle producto completo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const productoPorAliasController = async (req, res, next) => {
  try {
    const { codigo } = req.params;

    const alias = await buscarAliasPorDetalleProductoService(codigo);
    if (!alias) return res.status(404).json({ message: "Alias no encontrado" });

    const detalle = await buscarDetalleProductoIdService(alias.detalle_producto_id);
    if (!detalle) return res.status(404).json({ message: "Producto no encontrado" });

    const presentacion = alias.presentacion_id
      ? await buscarPresentacionPorIdService(alias.presentacion_id)
      : null;

    const fotos = await buscarFotosPorDetalleProductoService(detalle.id);
    const precioAnterior = await buscarUltimoPrecioCostoService(detalle.id);

    return res.status(200).json({
      detalle_producto_id: detalle.id,
      nombre: detalle.nombre_calculado,
      descripcion: detalle.descripcion,
      imagen: fotos?.[0]?.url_archivo ?? null,
      codigo_barras: alias.alias,
      presentacion_id: alias.presentacion_id ?? null,
      cantidad_presentacion: presentacion?.cantidad ?? 1,
      precio_anterior: precioAnterior?.precio_costo ?? 0,
      precio_actual: precioAnterior?.precio_costo ?? 0,
    });
  } catch (error) {
    next(error);
  }
};

export const buscarProductoGeneralController = async (req, res, next) => {
  try {
    const codigo = req.params.codigo;
    const alias = await buscarAliasPorCodigoService(codigo);

    if (!alias) return res.status(404).json({ message: "Código no registrado" });

    const detalle = await buscarDetalleProductoIdService(alias.detalle_producto_id);
    const foto = await buscarFotosPorDetalleProductoService(alias.detalle_producto_id);
    const presentacion = alias.presentacion_id
      ? await buscarPresentacionPorIdService(alias.presentacion_id)
      : null;
    const inventario = await buscarUltimoPrecioCostoService(alias.detalle_producto_id);

    res.json({
      detalle_producto_id: detalle.id,
      nombre: detalle.nombre_calculado,
      descripcion: detalle.descripcion,
      imagen: foto?.[0]?.url || null,
      codigo_barras: alias.alias,
      precio_actual: inventario?.precio_costo || 0,
      precio_anterior: inventario?.precio_costo || 0, // opcionalmente recuperar uno anterior
      presentacion_id: alias.presentacion_id,
      presentacion_nombre: presentacion?.nombre||"sin presentación",
      cantidad_presentacion: presentacion?.cantidad || 1,
    });
  } catch (error) {
    next(error);
  }
};
export const detalleProductoExpandidoController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const inventarios = await buscarInventarioPorDetalleProductoService(id);
    const precios = await buscarPreciosPorDetalleProductoService(id);

    res.json({ data: { inventarios, precios } });
  } catch (error) {
    next(error);
  }};


  export const obtenerDetalleProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const data = await getDetalleProductoById(id);
    if (!data) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(data);
  } catch (err) {
    console.error("Error al obtener detalle del producto:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
