import Joi from 'joi';

const productoUbicacionSchema = Joi.object({
  detalle_producto_id: Joi.number().integer().required().messages({
    'number.base': 'El ID del detalle de producto debe ser un número',
    'any.required': 'El ID del detalle de producto es obligatorio',
  }),
  inventario_id: Joi.number().integer().optional().allow(null),
  negocio_id: Joi.number().integer().required().messages({
    'number.base': 'El ID del negocio debe ser un número',
    'any.required': 'El ID del negocio es obligatorio',
  }),
  ubicacion_fisica_id: Joi.number().integer().required().messages({
    'number.base': 'El ID de la ubicación física debe ser un número',
    'any.required': 'La ubicación física es obligatoria',
  }),
  precio_id: Joi.number().integer().optional().allow(null),
  compartir: Joi.boolean().optional().default(false).messages({
    'boolean.base': 'El campo compartir debe ser booleano',
  }),
});

export { productoUbicacionSchema };
