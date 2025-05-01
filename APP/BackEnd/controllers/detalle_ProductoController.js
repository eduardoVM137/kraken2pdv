import { db } from "../config/database.js";

//insertar detalle producto con transaccion
import {
  insertarDetalleProductoServiceTx,
  editarDetalleProductoService,
  eliminarDetalleProductoService,
  mostrarDetalleProductosService,
  buscarDetalleProductoIdService,
} from "../services/detalle_ProductoService.js";
import { insertarMovimientoStockServiceTx } from "../services/movimientoStockService.js";
import { insertarStateServiceTx } from "../services/stateService.js";
import {
  insertarAtributoServiceTx,
  insertarDetalleAtributosServiceTx
} from "../services/atributoService.js";
//imports para buscar prductos con su id
import { insertarInventarioDesdeMovimientoTx } from "../services/inventarioService.js";
import { insertarPrecioDesdeMovimientoTx } from "../services/precioService.js";
import { insertarProductoUbicacionDesdeMovimientoTx,buscarUbicacionesPorDetalleProductoService } from "../services/producto_ubicacionService.js";
import { insertarAliasProductoTx } from '../services/etiquetaProductoService.js';
import { insertarMultimediaProductoTx,buscarFotosPorDetalleProductoService } from '../services/productoMultimediaService.js';

import { buscarAtributoPorIdService } from '../services/atributoService.js';
import { buscarDetallesAtributoService } from '../services/detalleAtributoService.js';
import { buscarAliasPorDetalleProductoService } from '../services/etiquetaProductoService.js';
import { buscarPreciosPorDetalleProductoService } from '../services/precioService.js';
 
import { buscarComponentesPorDetalleProductoService } from '../services/componenteService.js';
import { buscarDetalleProductoCeldaPorDetalleProductoService } from '../services/detalle_producto_celdaService.js';

import { insertarPresentacionServiceTx } from '../services/presentacionService.js'; // <<-- Asegúrate de tener este service creado.

import { insertarComponenteProductoTx } from '../services/componenteService.js'; // <<-- Asegúrate de tener este service creado.
 
import { insertarDetalleProductoCeldaTx } from '../services/detalle_producto_celdaService.js'; // <<-- Asegúrate de tener este service creado.

export const insertarDetalleProductoController = async (req, res, next) => {
  try {
    const {
      atributo,
      detalles_atributo = [],
      ubicaciones = [],
      etiquetas = [],
      fotos = [], 
      presentaciones = [], 
      componentes = [], 
      celdas = [], 
      compartir = false,
      ...resto
    } = req.body;

    const resultado = await db.transaction(async (tx) => {
      // 1. Insertar estado
      const state = await insertarStateServiceTx(tx, {
        tabla_afectada: "detalle_producto",
      });
      if (!state?.id) throw new Error("No se pudo generar el estado");

      // 2. Insertar atributo y detalles si existen
      let atributo_id = null;
      if (atributo?.nombre) {
        const atributoInsertado = await insertarAtributoServiceTx(tx, atributo);
        if (!atributoInsertado?.id) throw new Error("No se pudo insertar el atributo");
        atributo_id = atributoInsertado.id;

        if (Array.isArray(detalles_atributo) && detalles_atributo.length > 0) {
          const detallesConID = detalles_atributo.map((detalle) => ({
            ...detalle,
            id_atributo: atributoInsertado.id,
          }));
          await insertarDetalleAtributosServiceTx(tx, detallesConID);
        }
      }

      // 3. Insertar detalle_producto
      const detalleInsertado = await insertarDetalleProductoServiceTx(tx, {
        ...resto,
        atributo_id,
        state_id: state.id,
      });
      if (!detalleInsertado?.id) throw new Error("No se pudo insertar el detalle del producto");

      // 4. Insertar componentes si se proporcionan
      if (Array.isArray(componentes) && componentes.length > 0) {
        const lista = componentes.map(comp => ({
          detalle_producto_hijo_id: detalleInsertado.id,
          detalle_producto_padre_id: comp.detalle_producto_padre_id,
          cantidad: comp.cantidad,
        }));
        await insertarComponenteProductoTx(tx, lista);
      }
      
      
      

      // 4. Insertar ubicaciones, inventario y precios
      for (const u of ubicaciones) {
        const movimiento = await insertarMovimientoStockServiceTx(tx, {
          empresa_id: req.empresa_id || 1,
          producto_id: resto.producto_id,
          detalle_producto_id: detalleInsertado.id,
          ubicacion_id: u.ubicacion_fisica_id,
          cantidad: u.stock_actual,
          precio_costo: u.precio_costo,
          tipo_movimiento: 'ajuste_inicial',
          motivo: 'Alta inicial del detalle producto',
          usuario_id: req.usuario_id || null,
        });
        if (!movimiento?.id) throw new Error("No se pudo registrar el movimiento de stock");

        const inventarioInsertado = await insertarInventarioDesdeMovimientoTx(tx, {
          detalle_producto_id: detalleInsertado.id,
          stock_actual: u.stock_actual,
          stock_minimo: u.stock_minimo,
          precio_costo: u.precio_costo,
          ubicacion_fisica_id: u.ubicacion_fisica_id,
          proveedor_id: null,
          state_id: state.id,
        });
        // 5.1 Insertar detalle_producto_celda si hay celdas definidas
    
        
        if (Array.isArray(u.celdas) && u.celdas.length > 0) {
          const lista = u.celdas.map(celda => ({
            detalle_producto_id: detalleInsertado.id,
            inventario_id: inventarioInsertado.id,
            celda_id: celda.celda_id,
            contenedor_fisico_id: celda.contenedor_fisico_id,
            cantidad: celda.cantidad,
          }));
          await insertarDetalleProductoCeldaTx(tx, lista);
        }

      
      



        const preciosInsertados = [];
        if (u.precios?.length > 0) {
          for (const p of u.precios) {
            const precio = await insertarPrecioDesdeMovimientoTx(tx, {
              ...p,
              detalle_producto_id: detalleInsertado.id,
              ubicacion_fisica_id: u.ubicacion_fisica_id,
              fecha_inicio: p.fecha_inicio ? new Date(p.fecha_inicio) : null,
              fecha_fin: p.fecha_fin ? new Date(p.fecha_fin) : null,
            });
            preciosInsertados.push(precio);
          }
        }

        await insertarProductoUbicacionDesdeMovimientoTx(tx, {
          detalle_producto_id: detalleInsertado.id,
          inventario_id: inventarioInsertado.id,
          negocio_id: req.negocio_id || 1,
          ubicacion_fisica_id: u.ubicacion_fisica_id,
          precio_id: preciosInsertados[0]?.id || null,
          compartir: u.compartir === true,
        });
      }
      
  // 5. Insertar etiquetas (alias normales y alias para presentaciones)
  
  const mapaVirtual = {}; // idVirtual -> id real

  if (Array.isArray(presentaciones) && presentaciones.length > 0) {
    for (const pres of presentaciones) {
      const nueva = await insertarPresentacionServiceTx(tx, {
        detalle_producto_id: detalleInsertado.id,
        nombre: pres.nombre,
        cantidad: pres.cantidad,
        descripcion: pres.descripcion
      });
      if (pres.idVirtualPresentacion) {
        mapaVirtual[pres.idVirtualPresentacion] = nueva.id;
      }
    }
  }

  if (Array.isArray(etiquetas) && etiquetas.length > 0) {
    for (const etiqueta of etiquetas) {
      let presentacionId = etiqueta.presentacion_id || null;

      if (etiqueta.idVirtualPresentacion) {
        presentacionId = mapaVirtual[etiqueta.idVirtualPresentacion] || null;
      }

      await insertarAliasProductoTx(tx, [{
        detalle_producto_id: detalleInsertado.id,
        tipo: etiqueta.tipo,
        alias: etiqueta.alias,
        visible: etiqueta.visible ?? true,
        presentacion_id: presentacionId
      }]);
    }
  }

      // 6. Insertar multimedia
      if (Array.isArray(fotos) && fotos.length > 0) {
        await insertarMultimediaProductoTx(tx, fotos.map(f => ({
          detalle_producto_id: detalleInsertado.id,
          url_archivo: f
        })));
      }
      
 

      

      return detalleInsertado;
    });

    return res.status(201).json({ message: "Detalle producto creado", data: resultado });
  } catch (error) {
    console.error("Error en transacción de detalle_producto:", error);
    next(error);
  }
};




// export const insertarDetalleProductoController = async (req, res, next) => {
//   try {
//     const {
//       atributo,
//       detalles_atributo = [],
//       ubicaciones = [],
//       etiquetas = [],
//       fotos = [],
//       compartir = false,
//       ...resto
//     } = req.body;

//     const resultado = await db.transaction(async (tx) => {
//       // 1. Insertar estado
//       const state = await insertarStateServiceTx(tx, {
//         tabla_afectada: "detalle_producto",
//       });
//       if (!state?.id) throw new Error("No se pudo generar el estado");

//       // 2. Insertar atributo y detalles del atributo si existen
//       let atributo_id = null;
//       if (atributo?.nombre) {
//         const atributoInsertado = await insertarAtributoServiceTx(tx, atributo);
//         if (!atributoInsertado?.id) throw new Error("No se pudo insertar el atributo");
//         atributo_id = atributoInsertado.id;

//         if (Array.isArray(detalles_atributo) && detalles_atributo.length > 0) {
//           const detallesConID = detalles_atributo.map((detalle) => ({
//             ...detalle,
//             id_atributo: atributoInsertado.id,
//           }));
//           await insertarDetalleAtributosServiceTx(tx, detallesConID);
//         }
//       }

//       // 3. Insertar detalle_producto
//       const detalleInsertado = await insertarDetalleProductoServiceTx(tx, {
//         ...resto,
//         atributo_id,
//         state_id: state.id,
//       });
//       if (!detalleInsertado?.id) throw new Error("No se pudo insertar el detalle del producto");

//       // 4. Insertar múltiples ubicaciones con su inventario y precios
//       for (const u of ubicaciones) {
//         const movimiento = await insertarMovimientoStockServiceTx(tx, {
//           empresa_id: req.empresa_id || 1,
//           producto_id: resto.producto_id,
//           detalle_producto_id: detalleInsertado.id,
//           ubicacion_id: u.ubicacion_fisica_id,
//           cantidad: u.cantidad,
//           precio_costo: u.precio_costo,
//           tipo_movimiento: 'ajuste_inicial',
//           motivo: 'Alta inicial del detalle producto',
//           usuario_id: req.usuario_id || null,
//         });
//         if (!movimiento?.id) throw new Error("No se pudo registrar el movimiento de stock");

//         const inventarioInsertado = await insertarInventarioDesdeMovimientoTx(tx, {
//           detalle_producto_id: detalleInsertado.id,
//           cantidad: u.cantidad,
//           precio_costo: u.precio_costo,
//           ubicacion_fisica_id: u.ubicacion_fisica_id,
//           proveedor_id: null,
//           state_id: state.id,
//         });

//         const preciosInsertados = [];
//         if (u.precios?.length > 0) {
//           for (const p of u.precios) {
//             const precio = await insertarPrecioDesdeMovimientoTx(tx, {
//               ...p,
//               detalle_producto_id: detalleInsertado.id,
//               ubicacion_fisica_id: u.ubicacion_fisica_id,
//               fecha_inicio: p.fecha_inicio ? new Date(p.fecha_inicio) : null,
//               fecha_fin: p.fecha_fin ? new Date(p.fecha_fin) : null,
//             });
//             preciosInsertados.push(precio);
//           }
//         }

//         await insertarProductoUbicacionDesdeMovimientoTx(tx, {
//           detalle_producto_id: detalleInsertado.id,
//           inventario_id: inventarioInsertado.id,
//           negocio_id: req.negocio_id || 1,
//           ubicacion_fisica_id: u.ubicacion_fisica_id,
//           precio_id: preciosInsertados[0]?.id || null,
//           compartir: u.compartir === true,
//         });
//       }

//       // 5. Insertar etiquetas (alias normales y alias por presentacion)
//       if (Array.isArray(etiquetas) && etiquetas.length > 0) {
//         for (const etiqueta of etiquetas) {
//           let presentacionId = etiqueta.presentacion_id || null;

//           if ((etiqueta.tipo?.toLowerCase() === 'presentacion' || etiqueta.tipo?.toLowerCase() === 'ipresentacion') && !presentacionId) {
//             // Crear nueva presentación si no existe
//             const nuevaPresentacion = await insertarPresentacionServiceTx(tx, {
//               detalle_producto_id: detalleInsertado.id,
//               nombre: etiqueta.alias,
//               cantidad: etiqueta.cantidad || 1,
//               descripcion: etiqueta.descripcion || etiqueta.alias
//             });
//             presentacionId = nuevaPresentacion.id;
//           }

//           await insertarAliasProductoTx(tx, [{
//             detalle_producto_id: detalleInsertado.id,
//             tipo: etiqueta.tipo,
//             alias: etiqueta.alias,
//             visible: etiqueta.visible ?? true,
//             presentacion_id: presentacionId
//           }]);
//         }
//       }

//       // 6. Insertar multimedia si existen
//       if (Array.isArray(fotos) && fotos.length > 0) {
//         await insertarMultimediaProductoTx(tx, fotos.map(f => ({
//           detalle_producto_id: detalleInsertado.id,
//           url_archivo: f
//         })));
//       }

//       return detalleInsertado;
//     });

//     return res.status(201).json({ message: "Detalle producto creado", data: resultado });
//   } catch (error) {
//     console.error("Error en transacción de detalle_producto:", error);
//     next(error);
//   }
// };

//crassd
// export const insertarDetalleProductoController = async (req, res, next) => {
//   try {
//     const {
//       atributo,
//       detalles_atributo = [],
//       ubicaciones = [],
//       alias = [],
//       fotos = [],
//       compartir = false,
//       ...resto
//     } = req.body;

//     const resultado = await db.transaction(async (tx) => {
//       // 1. Insertar estado
//       const state = await insertarStateServiceTx(tx, {
//         tabla_afectada: "detalle_producto",
//       });
//       if (!state?.id) throw new Error("No se pudo generar el estado");

//       // 2. Insertar atributo y detalle_atributo si existe
//       let atributo_id = null;
//       if (atributo?.nombre) {
//         const atributoInsertado = await insertarAtributoServiceTx(tx, atributo);
//         if (!atributoInsertado?.id) throw new Error("No se pudo insertar el atributo");
//         atributo_id = atributoInsertado.id;

//         if (Array.isArray(detalles_atributo) && detalles_atributo.length > 0) {
//           const detallesConID = detalles_atributo.map((detalle) => ({
//             ...detalle,
//             id_atributo: atributoInsertado.id,
//           }));
//           await insertarDetalleAtributosServiceTx(tx, detallesConID);
//         }
//       }

//       // 3. Insertar detalle_producto
//       const detalleInsertado = await insertarDetalleProductoServiceTx(tx, {
//         ...resto,
//         atributo_id,
//         state_id: state.id,
//       });
//       if (!detalleInsertado?.id) throw new Error("No se pudo insertar el detalle del producto");

//       // 4. Insertar múltiples ubicaciones con su inventario y precios si existen
//       for (const u of ubicaciones) {
//         const movimiento = await insertarMovimientoStockServiceTx(tx, {
//           empresa_id: req.empresa_id || 1,
//           producto_id: resto.producto_id,
//           detalle_producto_id: detalleInsertado.id,
//           ubicacion_id: u.ubicacion_fisica_id,
//           cantidad: u.cantidad,
//           precio_costo: u.precio_costo,
//           tipo_movimiento: 'ajuste_inicial',
//           motivo: 'Alta inicial del detalle producto',
//           usuario_id: req.usuario_id || null,
//         });
//         if (!movimiento?.id) throw new Error("No se pudo registrar el movimiento de stock");

//         const inventarioInsertado = await insertarInventarioDesdeMovimientoTx(tx, {
//           detalle_producto_id: detalleInsertado.id,
//           cantidad: u.cantidad,
//           precio_costo: u.precio_costo,
//           ubicacion_fisica_id: u.ubicacion_id,
//           proveedor_id: null,
//           state_id: state.id
//         });

//         const preciosInsertados = [];
//         if (u.precios?.length > 0) {
//           for (const p of u.precios) {
//             const precio = await insertarPrecioDesdeMovimientoTx(tx, {
//               ...p,
//               detalle_producto_id: detalleInsertado.id,
//               ubicacion_fisica_id: u.ubicacion_id
//             });
//             preciosInsertados.push(precio);
//           }
//         }

//         await insertarProductoUbicacionDesdeMovimientoTx(tx, {
//           detalle_producto_id: detalleInsertado.id,
//           inventario_id: inventarioInsertado.id,
//           negocio_id: req.negocio_id || 1,
//           ubicacion_fisica_id: u.ubicacion_id,
//           precio_id: preciosInsertados[0]?.id || null,
//           compartir: u.compartir === true
//         });
//       }

//       // 5. Insertar alias si existen
//       if (Array.isArray(alias) && alias.length > 0) {
//         await insertarAliasProductoTx(tx, alias.map(a => ({
//           detalle_producto_id: detalleInsertado.id,
//           codigo: a.codigo
//         })));
//       }

//       // 6. Insertar multimedia si existen
//       if (Array.isArray(fotos) && fotos.length > 0) {
//         await insertarMultimediaProductoTx(tx, fotos.map(f => ({
//           detalle_producto_id: detalleInsertado.id,
//           url_archivo: f
//         })));
//       }

//       return detalleInsertado;
//     });

//     return res.status(201).json({ message: "Detalle producto creado", data: resultado });
//   } catch (error) {
//     console.error("Error en transacción de detalle_producto:", error);
//     next(error);
//   }
// };



// Crear
// export const insertarDetalleProductoController = async (req, res, next) => {
//   try {
//     const { atributo, detalles_atributo = [], ...resto } = req.body;

//     const resultado = await db.transaction(async (tx) => {
//       // 1. Insertar estado
//       const state = await insertarStateServiceTx(tx, {
//         tabla_afectada: "detalle_producto",
//       });
//       if (!state?.id) throw new Error("No se pudo generar el estado");

//       // 2. Insertar atributo y detalle_atributo si existe
//       let atributo_id = null;
//       if (atributo?.nombre) {
//         const atributoInsertado = await insertarAtributoServiceTx(tx, atributo);
//         if (!atributoInsertado?.id) throw new Error("No se pudo insertar el atributo");
//         atributo_id = atributoInsertado.id;

//         if (Array.isArray(detalles_atributo) && detalles_atributo.length > 0) {
//           const detallesConID = detalles_atributo.map((detalle) => ({
//             ...detalle,
//             id_atributo: atributoInsertado.id,
//           }));
//           await insertarDetalleAtributosServiceTx(tx, detallesConID);
//         }
//       }

//       // 3. Insertar detalle_producto
//       const detalleInsertado = await insertarDetalleProductoServiceTx(tx, {
//         ...resto,
//         atributo_id,
//         state_id: state.id,
//       });
//       if (!detalleInsertado?.id) throw new Error("No se pudo insertar el detalle del producto");

//       // 4. Insertar movimiento stock inicial si aplica
//       if (resto.cantidad && resto.ubicacion_id) {
//         const movimiento = await insertarMovimientoStockServiceTx(tx, {
//           empresa_id: req.empresa_id || 1,
//           producto_id: resto.producto_id,
//           detalle_producto_id: detalleInsertado.id,
//           ubicacion_id: resto.ubicacion_id,
//           cantidad: resto.cantidad,
//           precio_costo: resto.precio_costo || null,
//           tipo_movimiento: 'ajuste_inicial',
//           motivo: 'Alta inicial del detalle producto',
//           usuario_id: req.usuario_id || null,
//         });

//         if (!movimiento?.id) throw new Error("No se pudo registrar el movimiento de stock");
//       }

//       return detalleInsertado;
//     });

//     return res.status(201).json({ message: "Detalle producto creado", data: resultado });
//   } catch (error) {
//     console.error("Error en transacción de detalle_producto:", error);
//     next(error);
//   }
// };


 // Crear 1
// export const insertarDetalleProductoController = async (req, res, next) => {
//   const rollback = {
//     atributo_id: null,
//     state_id: null,
//     fallido: false
//   };

//   try {
//     const { atributo, detalles_atributo = [], ...resto } = req.body;
//     const data = { ...resto };

//     // 1. Generar state si no se envía
//     if (!data.state_id) {
//       const state = await insertarStateService({ tabla_afectada: "detalle_producto" });
//       if (!state || !state.id) throw new Error("No se pudo generar el estado");
//       data.state_id = state.id;
//       rollback.state_id = state.id;
//     }

//     // 2. Insertar atributo y sus detalles si vienen
//     if (atributo && atributo.nombre) {
//       const atributoInsertado = await insertarAtributoService(atributo);
//       if (!atributoInsertado || !atributoInsertado.id) throw new Error("No se pudo insertar el atributo");

//       data.atributo_id = atributoInsertado.id;
//       rollback.atributo_id = atributoInsertado.id;

//       if (Array.isArray(detalles_atributo) && detalles_atributo.length > 0) {
//         const detallesConID = detalles_atributo.map((detalle) => ({
//           ...detalle,
//           id_atributo: atributoInsertado.id,
//         }));

//         const detallesInsertados = await insertarDetalleAtributosService(detallesConID);
//         if (!detallesInsertados) throw new Error("No se pudieron insertar los detalles del atributo");
//       }
//     } else {
//       data.atributo_id = null;
//     }

//     // 3. Insertar el detalle producto final
//     const insertado = await insertarDetalleProductoService(data);
//     if (!insertado) throw new Error("No se pudo insertar el detalle del producto");

//     res.status(201).json({
//       message: "Detalle producto creado correctamente",
//       data: insertado,
//     });
//   } catch (error) {
//     console.error("Error al insertar detalle_producto:", error);
//     rollback.fallido = true;

//     // Rollback
//     if (rollback.atributo_id) await eliminarDetalleAtributosPorAtributoService(rollback.atributo_id);
//     if (rollback.atributo_id) await eliminarAtributoService(rollback.atributo_id);
//     if (rollback.state_id) await eliminarStateService(rollback.state_id);

//     next(error);
//   }
// };

// Editar

export const editarDetalleProductoController = async (req, res, next) => {
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
    const alias = await buscarAliasPorDetalleProductoService(id);
    const fotos = await buscarFotosPorDetalleProductoService(id);
    const ubicaciones = await buscarUbicacionesPorDetalleProductoService(id);
    const precios = await buscarPreciosPorDetalleProductoService(id);
    const celdas = await buscarDetalleProductoCeldaPorDetalleProductoService(id);
    // 🚧 Aún no tienes este service, pero ya está preparado para usar:
    const componentes = await buscarComponentesPorDetalleProductoService(id);

    const celdasPorInventario = {};
    for (const c of celdas) {
      if (!celdasPorInventario[c.inventario_id]) {
        celdasPorInventario[c.inventario_id] = [];
      }
      celdasPorInventario[c.inventario_id].push(c);
    }

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
      alias,
      fotos,
      ubicaciones: ubicaciones.map(u => ({
        ...u,
        precios: precios.filter(p => p.ubicacion_fisica_id === u.ubicacion_fisica_id),
        celdas: celdas
      })),
       componentes // <- descomenta cuando tengas el service
    };

    return res.status(200).json({ data: resultado });
  } catch (error) {
    console.error("Error al buscar detalle producto completo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
