import Joi from 'joi';
import { etiquetaProductoSchema } from './validarEtiquetaProducto.js';
import { presentacionSchemaOpcional } from './validarPresentacion.js';
import { componenteSchema } from './validarComponente.js';
import { celdaSchema } from './validarDetalleProductoCelda.js';

// 🔹 Esquema base común
const baseDetalleProductoSchema = Joi.object({
  producto_id: Joi.number().integer().optional(),
  medida: Joi.number().precision(2).optional(),
  unidad_medida: Joi.string().max(20).optional().allow(null, ''),
  marca_id: Joi.string().max(100).optional().allow(null, ''),
  descripcion: Joi.string().optional().allow(null, ''),
  nombre_calculado: Joi.string().optional().allow(null, ''),
  activo: Joi.boolean().optional(),
  atributo_id: Joi.number().integer().optional().allow(null),
  state_id: Joi.number().integer().optional().allow(null),
  tipo_movimiento: Joi.string().valid('ajuste_inicial').optional(),

  atributo: Joi.object({
    nombre: Joi.string().max(100).required()
  }).optional(),

  detalles_atributo: Joi.array().items(
    Joi.object({
      valor: Joi.string().max(100).required()
    })
  ).optional(),

  componentes: Joi.array().items(componenteSchema).optional(),

  ubicaciones: Joi.array().items(
    Joi.object({
      ubicacion_fisica_id: Joi.number().integer().required(),
      negocio_id: Joi.number().integer().required(),
      stock_actual: Joi.number().positive().required(),
      // stock_minimo: Joi.number().positive().required(),
      precio_costo: Joi.number().precision(2).required(),
      compartir: Joi.boolean().optional().default(false),
      celdas: Joi.array().items(celdaSchema).optional(),
      precios: Joi.array().items(
        Joi.object({
          precio_venta: Joi.number().precision(2).required(),
          vigente: Joi.boolean().optional(),
          fecha_inicio: Joi.date().optional(),
          fecha_fin: Joi.date().optional().allow(null),
          cliente_id: Joi.number().integer().optional().allow(null),
          tipo_cliente_id: Joi.number().integer().optional().allow(null),
          cantidad_minima: Joi.number().integer().optional().allow(null),
          precio_base: Joi.number().precision(2).optional().allow(null),
          prioridad: Joi.number().integer().optional().allow(null),
          descripcion: Joi.string().max(150).optional().allow(null, '')
        })
      ).optional()
    })
  ).optional(),

  presentaciones: Joi.array().items(presentacionSchemaOpcional).optional(),

  etiquetas: Joi.array()
    .items(etiquetaProductoSchema)
    .optional()
    .custom((etqs, helpers) => {
      for (const e of etqs || []) {
        if (!e.alias) {
          return helpers.message('Cada etiqueta debe tener tipo y alias definidos');
        }
      }
      return etqs;
    }),

  fotos: Joi.array().items(
    Joi.string().uri().messages({
      'string.uri': 'Cada foto debe ser una URL válida'
    })
  ).optional(),

}).custom((value, helpers) => {
  if (value.tipo_movimiento === 'ajuste_inicial') {
    if (!Array.isArray(value.ubicaciones) || value.ubicaciones.length === 0) {
      return helpers.message('Debe incluir al menos una ubicación para ajuste_inicial');
    }
    for (const u of value.ubicaciones) {
      if (!u.stock_actual) return helpers.message('El stock actual es obligatorio en cada ubicación');
      if (!u.ubicacion_fisica_id) return helpers.message('ubicacion_fisica_id es obligatoria en cada ubicación');
      if (typeof u.precio_costo !== 'number') return helpers.message('precio_costo es obligatorio en cada ubicación');
    }
  }
  return value;
}, 'Condición para ajuste_inicial');

// 🔹 Esquema para creación
export const detalleProductoCrearSchema = baseDetalleProductoSchema.keys({
  producto_id: Joi.number().integer().required(),
  medida: Joi.number().precision(2).required(),
  unidad_medida: Joi.string().max(20).required(),
  ubicaciones: baseDetalleProductoSchema.extract('ubicaciones').required().min(1)
});

// 🔹 Esquema para edición
export const detalleProductoEditarSchema = baseDetalleProductoSchema.min(1);

export default detalleProductoCrearSchema;


// import Joi from 'joi';
// import { etiquetaProductoSchema } from './validarEtiquetaProducto.js';
// import { presentacionSchemaOpcional } from './validarPresentacion.js';
// import { componenteSchema } from './validarComponente.js';
// import { celdaSchema } from './validarDetalleProductoCelda.js';
// export const detalleProductoSchema = Joi.object({
//   producto_id: Joi.number().integer().required().messages({
//     'number.base': 'El ID de producto debe ser un número',
//     'number.integer': 'El ID de producto debe ser un número entero',
//     'any.required': 'El ID de producto es obligatorio',
//   }),
//   medida: Joi.number().precision(2).required().messages({
//     'number.base': 'La medida debe ser un número',
//     'any.required': 'La medida es obligatoria',
//   }),
//   unidad_medida: Joi.string().max(20).required().messages({
//     'string.base': 'La unidad de medida debe ser un texto',
//     'string.max': 'La unidad no debe exceder 20 caracteres',
//     'any.required': 'La unidad de medida es obligatoria',
//   }),
//   marca_id: Joi.string().max(100).optional().allow(null, '').messages({
//     'string.max': 'La marca no debe exceder 100 caracteres',
//   }),
//   descripcion: Joi.string().optional().allow('').messages({
//     'string.base': 'La descripción debe ser un texto',
//   }),
//   nombre_calculado: Joi.string().optional().allow('').messages({
//     'string.base': 'El nombre calculado debe ser un texto',
//   }),
//   activo: Joi.boolean().optional().messages({
//     'boolean.base': 'El valor de activo debe ser booleano',
//   }),
//   atributo_id: Joi.number().integer().optional().allow(null).messages({
//     'number.base': 'El ID del atributo debe ser un número',
//     'number.integer': 'El ID del atributo debe ser un número entero',
//   }),
//   state_id: Joi.number().integer().optional().allow(null).messages({
//     'number.base': 'El ID del estado debe ser un número',
//     'number.integer': 'El ID del estado debe ser un número entero',
//   }),

//   tipo_movimiento: Joi.string().valid('ajuste_inicial').optional(),

//   atributo: Joi.object({
//     nombre: Joi.string().max(100).required().messages({
//       'string.base': 'El nombre del atributo debe ser un texto',
//       'string.max': 'El nombre del atributo no debe exceder 100 caracteres',
//       'any.required': 'El nombre del atributo es obligatorio',
//     }),
//   }).optional(),

//   detalles_atributo: Joi.array()
//     .items(
//       Joi.object({
//         valor: Joi.string().max(100).required().messages({
//           'string.base': 'El valor del detalle debe ser un texto',
//           'string.max': 'El valor del detalle no debe exceder 100 caracteres',
//           'any.required': 'El valor del detalle es obligatorio',
//         }),
//       })
//     )
//     .optional(),

//     componentes: Joi.array().items(componenteSchema).optional(),
//   ubicaciones: Joi.array().items(
//     Joi.object({
//       ubicacion_fisica_id: Joi.number().integer().required().messages({
//         'number.base': 'La ubicación física debe ser un número',
//         'any.required': 'La ubicación física es obligatoria',
//       }),
//       negocio_id: Joi.number().integer().required().messages({
//         'number.base': 'El ID del negocio debe ser un número',
//         'any.required': 'El ID del negocio es obligatorio',
//       }),
//       stock_actual: Joi.number().positive().required().messages({
//         'number.base': 'La stock_actual debe ser un número',
//         'number.positive': 'La stock_actual debe ser mayor a 0',
//         'any.required': 'La stock_actual es obligatoria',
//       }),   
//       // stock_minimo: Joi.number().positive().required().messages({
//       //   'number.base': 'La stock minimo debe ser un número',
//       //   'number.positive': 'La cantidad debe ser mayor a 0',
//       //   'any.required': 'La stock minimo es obligatoria',
//       // }),
//       precio_costo: Joi.number().precision(2).required().messages({
//         'number.base': 'El precio de costo debe ser un número',
//         'any.required': 'El precio de costo es obligatorio',
//       }),
//       compartir: Joi.boolean().optional().default(false).messages({
//         'boolean.base': 'El campo compartir debe ser booleano',
//       }),
//       celdas: Joi.array().items(celdaSchema).optional(),
//       precios: Joi.array().items(
//         Joi.object({
//           precio_venta: Joi.number().precision(2).required().messages({
//             'number.base': 'El precio de venta debe ser un número',
//             'any.required': 'El precio de venta es obligatorio',
//           }),
//           vigente: Joi.boolean().optional().messages({
//             'boolean.base': 'Debe ser un valor booleano',
//           }),
//           fecha_inicio: Joi.date().optional().messages({
//             'date.base': 'La fecha de inicio debe ser válida',
//           }),
//           fecha_fin: Joi.date().optional().allow(null).messages({
//             'date.base': 'La fecha fin debe ser válida',
//           }),
//           cliente_id: Joi.number().integer().optional().allow(null),
//           tipo_cliente_id: Joi.number().integer().optional().allow(null),
//           cantidad_minima: Joi.number().integer().optional().allow(null),
//           precio_base: Joi.number().precision(2).optional().allow(null),
//           prioridad: Joi.number().integer().optional().allow(null),
//           descripcion: Joi.string().max(150).optional().allow(null, '')
//         })
//       ).optional()
//     })
//   ).required().min(1).messages({
//     'array.base': 'Debe ser un arreglo de ubicaciones',
//     'array.min': 'Debe haber al menos una ubicación definida',
//   }),
//   presentaciones: Joi.array().items(presentacionSchemaOpcional).optional(),

//   etiquetas: Joi.array()
//     .items(etiquetaProductoSchema)
//     .optional()
//     .custom((etqs, helpers) => {
//       for (const e of etqs || []) {
//         if (!e.alias) {//!e.tipo || 
//           return helpers.message('Cada etiqueta debe tener tipo y alias definidos');
//         }
//       }
//       return etqs;
//     }),

//   fotos: Joi.array().items(Joi.string().uri().messages({
//     'string.uri': 'Cada foto debe ser una URL válida',
//   })).optional(),

// }).custom((value, helpers) => {
//   if (value.tipo_movimiento === 'ajuste_inicial') {
//     if (!Array.isArray(value.ubicaciones) || value.ubicaciones.length === 0) {
//       return helpers.message('Debe incluir al menos una ubicación para ajuste_inicial');
//     }
//     for (const u of value.ubicaciones) {
//       if (!u.stock_actual) return helpers.message('El stock actual es obligatorio en cada ubicación');
//    //   if (!u.stock_minimo) return helpers.message('El stock mínimo es obligatorio en cada ubicación');
//       if (!u.ubicacion_fisica_id) return helpers.message('ubicacion_fisica_id es obligatoria en cada ubicación');
//       if (typeof u.precio_costo !== 'number') return helpers.message('precio_costo es obligatorio en cada ubicación');
//     }
//   }
//   return value;
// }, 'Condición para ajuste_inicial');

// export default detalleProductoSchema;
