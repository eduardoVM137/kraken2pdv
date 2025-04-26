import Joi from 'joi';

const precioSchema = Joi.object({
  detalle_producto_id: Joi.number().integer().required().messages({
    'number.base': 'El ID del detalle de producto debe ser un número',
    'any.required': 'El ID del detalle de producto es obligatorio',
  }),
  ubicacion_fisica_id: Joi.number().integer().required().messages({
    'number.base': 'El ID de la ubicación física debe ser un número',
    'any.required': 'La ubicación física es obligatoria',
  }),
  precio_venta: Joi.number().precision(2).required().messages({
    'number.base': 'El precio de venta debe ser un número',
    'any.required': 'El precio de venta es obligatorio',
  }),
  vigente: Joi.boolean().optional().messages({
    'boolean.base': 'El campo vigente debe ser booleano',
  }),
  fecha_inicio: Joi.date().optional().messages({
    'date.base': 'La fecha de inicio debe ser válida',
  }),
  fecha_fin: Joi.date().optional().allow(null).messages({
    'date.base': 'La fecha fin debe ser válida',
  }),
  cliente_id: Joi.number().integer().optional().allow(null),
  tipo_cliente_id: Joi.number().integer().optional().allow(null),
  cantidad_minima: Joi.number().integer().optional().allow(null),
  precio_base: Joi.number().precision(2).optional().allow(null),
  prioridad: Joi.number().integer().optional().allow(null),
  descripcion: Joi.string().max(150).optional().allow(null, '').messages({
    'string.max': 'La descripción no debe exceder 150 caracteres',
  }),
  presentacion_id: Joi.number().integer().optional().allow(null),
});

export { precioSchema };
