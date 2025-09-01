 import Joi from 'joi';

export const componenteSchema = Joi.object({
  detalle_producto_padre_id: Joi.number().integer().required().messages({
    'number.base': 'El ID del producto padre debe ser un número',
    'any.required': 'El producto padre es obligatorio',
  }),
  cantidad: Joi.number().positive().required().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.positive': 'La cantidad debe ser mayor a 0',
    'any.required': 'La cantidad es obligatoria',
  }),
});
