import Joi from 'joi';

const presentacionSchema = Joi.object({
  detalle_producto_id: Joi.number().integer().required().messages({
    'number.base': 'El ID del detalle de producto debe ser un número',
    'number.integer': 'Debe ser un número entero',
    'any.required': 'El ID del detalle de producto es obligatorio',
  }),
  nombre: Joi.string().max(100).required().messages({
    'string.base': 'El nombre debe ser una cadena de texto',
    'string.max': 'El nombre no debe exceder 100 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  cantidad: Joi.number().precision(2).required().messages({
    'number.base': 'La cantidad debe ser un número',
    'any.required': 'La cantidad es obligatoria',
  }),
  descripcion: Joi.string().allow(null, '').max(255).optional().messages({
    'string.max': 'La descripción no debe exceder 255 caracteres',
  }),
});


export { presentacionSchema };
