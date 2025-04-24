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

  // Nuevos campos aceptados
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
});

export default detalleProductoSchema;
