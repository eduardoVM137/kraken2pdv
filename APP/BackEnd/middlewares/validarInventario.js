import Joi from 'joi';

const inventarioSchema = Joi.object({
  detalle_producto_id: Joi.number().integer().required().messages({
    'number.base': 'El ID del detalle de producto debe ser un número',
    'any.required': 'El ID del detalle de producto es obligatorio',
  }),
  stock_actual: Joi.number().precision(2).required().messages({
    'number.base': 'El stock actual debe ser un número',
    'any.required': 'El stock actual es obligatorio',
  }),
  stock_minimo: Joi.number().precision(2).optional().allow(null),
  precio_costo: Joi.number().precision(2).optional().allow(null),
  actualizado_en: Joi.date().optional().allow(null),
  ubicacion_fisica_id: Joi.number().integer().required().messages({
    'number.base': 'La ubicación física debe ser un número',
    'any.required': 'La ubicación física es obligatoria',
  }),
  proveedor_id: Joi.number().integer().optional().allow(null),
  state_id: Joi.number().integer().optional().allow(null),
});

export { inventarioSchema };
