import { db } from "../config/database.js";

import {
  insertarDetalleProductoService,
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

import { insertarInventarioDesdeMovimientoTx } from "../services/inventarioService.js";
import { insertarPrecioDesdeMovimientoTx } from "../services/precioService.js";
import { insertarProductoUbicacionDesdeMovimientoTx } from "../services/producto_ubicacionService.js";


//crassd
export const insertarDetalleProductoController = async (req, res, next) => {
  try {
    const {
      atributo,
      detalles_atributo = [],
      cantidad,
      precio_costo,
      ubicacion_id,
      ...resto
    } = req.body;

    const resultado = await db.transaction(async (tx) => {
      // 1. Insertar estado
      const state = await insertarStateServiceTx(tx, {
        tabla_afectada: "detalle_producto",
      });
      if (!state?.id) throw new Error("No se pudo generar el estado");

      // 2. Insertar atributo y detalle_atributo si existe
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

      // 4. Insertar movimiento stock inicial si aplica
      if (cantidad && ubicacion_id) {
        const movimiento = await insertarMovimientoStockServiceTx(tx, {
          empresa_id: req.empresa_id || 1,
          producto_id: resto.producto_id,
          detalle_producto_id: detalleInsertado.id,
          ubicacion_id,
          cantidad,
          precio_costo: precio_costo || null,
          tipo_movimiento: 'ajuste_inicial',
          motivo: 'Alta inicial del detalle producto',
          usuario_id: req.usuario_id || null,
        });

        if (!movimiento?.id) throw new Error("No se pudo registrar el movimiento de stock");

        // 5. Insertar inventario
        await insertarInventarioDesdeMovimientoTx(tx, {
          detalle_producto_id: detalleInsertado.id,
          cantidad,
          precio_costo,
          ubicacion_fisica_id: ubicacion_id,
          proveedor_id: null,
          state_id: state.id
        });

        // 6. Insertar precio base
        await insertarPrecioDesdeMovimientoTx(tx, {
          detalle_producto_id: detalleInsertado.id,
          ubicacion_fisica_id: ubicacion_id,
          precio_venta: 0,
          vigente: true,
          fecha_inicio: new Date(),
          cliente_id: null,
          tipo_cliente_id: null,
          cantidad_minima: 0,
          precio_base: 0,
          prioridad: 1
        });

        // 7. Insertar relación producto-ubicación
        await insertarProductoUbicacionDesdeMovimientoTx(tx, {
          detalle_producto_id: detalleInsertado.id,
          inventario_id: null,
          negocio_id: req.negocio_id || 1,
          ubicacion_fisica_id: ubicacion_id,
          precio_id: null,
          compartir: false
        });
      }

      return detalleInsertado;
    });

    return res.status(201).json({ message: "Detalle producto creado", data: resultado });
  } catch (error) {
    console.error("Error en transacción de detalle_producto:", error);
    next(error);
  }
};


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

    const data = await editarDetalleProductoService(id, req.body);
    if (!data) return res.status(404).json({ message: "Detalle producto no encontrado" });

    res.status(200).json({ message: "Detalle producto actualizado", data });
  } catch (error) {
    next(error);
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
