import Joi from 'joi';

export const detalleProductoSchema = Joi.object({
  producto_id: Joi.number().integer().required().messages({
    'number.base': 'El ID de producto debe ser un número',
    'number.integer': 'El ID de producto debe ser un número entero',
    'any.required': 'El ID de producto es obligatorio',
  }),
  medida: Joi.number().precision(2).required().messages({
    'number.base': 'La medida debe ser un número',
    'any.required': 'La medida es obligatoria',
  }),
  unidad_medida: Joi.string().max(20).required().messages({
    'string.base': 'La unidad de medida debe ser un texto',
    'string.max': 'La unidad no debe exceder 20 caracteres',
    'any.required': 'La unidad de medida es obligatoria',
  }),
  marca_id: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'La marca no debe exceder 100 caracteres',
  }),
  descripcion: Joi.string().optional().allow('').messages({
    'string.base': 'La descripción debe ser un texto',
  }),
  nombre_calculado: Joi.string().optional().allow('').messages({
    'string.base': 'El nombre calculado debe ser un texto',
  }),
  activo: Joi.boolean().optional().messages({
    'boolean.base': 'El valor de activo debe ser booleano',
  }),
  atributo_id: Joi.number().integer().optional().allow(null).messages({
    'number.base': 'El ID del atributo debe ser un número',
    'number.integer': 'El ID del atributo debe ser un número entero',
  }),
  state_id: Joi.number().integer().optional().allow(null).messages({
    'number.base': 'El ID del estado debe ser un número',
    'number.integer': 'El ID del estado debe ser un número entero',
  }),

  // 👇 Campos nuevos (stock inicial)
  cantidad: Joi.number().positive().optional().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.positive': 'La cantidad debe ser mayor a 0',
  }),
  ubicacion_id: Joi.number().integer().optional().messages({
    'number.base': 'La ubicación debe ser un número',
    'number.integer': 'La ubicación debe ser un número entero',
  }),
  precio_costo: Joi.number().precision(2).optional().messages({
    'number.base': 'El precio de costo debe ser un número',
  }),

  tipo_movimiento: Joi.string().valid('ajuste_inicial').optional(),
  // 👇 Atributos opcionales
  atributo: Joi.object({
    nombre: Joi.string().max(100).required().messages({
      'string.base': 'El nombre del atributo debe ser un texto',
      'string.max': 'El nombre del atributo no debe exceder 100 caracteres',
      'any.required': 'El nombre del atributo es obligatorio',
    }),
  }).optional(),

  detalles_atributo: Joi.array()
    .items(
      Joi.object({
        valor: Joi.string().max(100).required().messages({
          'string.base': 'El valor del detalle debe ser un texto',
          'string.max': 'El valor del detalle no debe exceder 100 caracteres',
          'any.required': 'El valor del detalle es obligatorio',
        }),
      })
    )
    .optional(),
  })
  .custom((value, helpers) => {
    // Validar si es ajuste inicial
    if (value.tipo_movimiento === 'ajuste_inicial') {
      if (!value.cantidad) return helpers.message('"cantidad" es obligatoria para ajuste_inicial');
      if (!value.ubicacion_id) return helpers.message('"ubicacion_id" es obligatoria para ajuste_inicial');
      if (typeof value.precio_costo !== 'number') return helpers.message('"precio_costo" es obligatoria para ajuste_inicial');
    }
    return value;
  }, 'Condición para ajuste_inicial');
  
  export default detalleProductoSchema;
