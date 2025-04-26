import Joi from 'joi';

const etiquetaProductoSchema = Joi.object({
  tipo: Joi.string().max(50).required().messages({
    'string.base': 'El tipo debe ser un texto',
    'string.max': 'El tipo no debe exceder 50 caracteres',
    'any.required': 'El tipo es obligatorio',
  }),
  alias: Joi.string().max(200).required().messages({
    'string.base': 'El alias debe ser un texto',
    'string.max': 'El alias no debe exceder 200 caracteres',
    'any.required': 'El alias es obligatorio',
  }),
  visible: Joi.boolean().optional().default(true).messages({
    'boolean.base': 'El campo visible debe ser booleano',
  }),
  state_id: Joi.string().optional().allow(null, '').messages({
    'string.base': 'El ID del estado debe ser un texto',
  }),
  presentacion_id: Joi.number().integer().optional().allow(null).messages({
    'number.base': 'El ID de la presentación debe ser un número',
    'number.integer': 'El ID de la presentación debe ser un número entero',
  }),
});

export { etiquetaProductoSchema };
