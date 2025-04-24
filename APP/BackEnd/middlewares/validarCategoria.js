import Joi from 'joi';

const categoriaSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    'string.base': 'El nombre debe ser un texto',
    'string.empty': 'El nombre no puede estar vacío',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no debe exceder 100 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  descripcion: Joi.string().max(200).allow('').optional().messages({
    'string.max': 'La descripción no debe exceder 200 caracteres',
  }),
  estado: Joi.boolean().optional().messages({
    'boolean.base': 'El valor de estado debe ser booleano',
  }),
  state_id: Joi.number().integer().allow(null).optional().messages({
    'number.base': 'El ID de estado debe ser un número',
    'number.integer': 'El ID de estado debe ser un número entero',
  }),
});

export { categoriaSchema };
