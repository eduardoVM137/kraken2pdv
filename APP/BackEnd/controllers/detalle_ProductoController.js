import { db } from "../config/database.js";

import {
  insertarDetalleProductoService,
  insertarDetalleProductoServiceTx,
  editarDetalleProductoService,
  eliminarDetalleProductoService,
  mostrarDetalleProductosService,
  buscarDetalleProductoIdService,
} from "../services/detalle_ProductoService.js";
import { insertarStateServiceTx } from "../services/stateService.js";
import {
  insertarAtributoServiceTx,
  insertarDetalleAtributosServiceTx
} from "../services/atributoService.js";
// Crear
export const insertarDetalleProductoController = async (req, res, next) => {
  try {
    const { atributo, detalles_atributo = [], ...resto } = req.body;

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
      console.log("Datos para insertar detalle_producto:", {
        ...resto,
        atributo_id,
        state_id: state.id,
      });
      
      // 3. Insertar detalle_producto
      const detalleInsertado = await insertarDetalleProductoServiceTx(tx, {
        ...resto,
        atributo_id,
        state_id: state.id,
      });
      if (!detalleInsertado?.id) throw new Error("No se pudo insertar el detalle del producto");

      return detalleInsertado;
    });

    return res.status(201).json({ message: "Detalle producto creado", data: resultado });
  } catch (error) {
    console.error("Error en transacción de detalle_producto:", error);
    next(error);
  }
};

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
