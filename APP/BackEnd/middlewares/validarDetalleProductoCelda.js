import Joi from 'joi';

export const celdaSchema = Joi.object({
  celda_id: Joi.number().integer().required().messages({
    'number.base': 'El ID de la celda debe ser un número',
    'any.required': 'El ID de la celda es obligatorio',
  }),
  contenedor_fisico_id: Joi.number().integer().required().messages({
    'number.base': 'El contenedor físico debe ser un número',
    'any.required': 'El contenedor físico es obligatorio',
  }),
  cantidad: Joi.number().positive().required().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.positive': 'La cantidad debe ser mayor a 0',
    'any.required': 'La cantidad es obligatoria',
  }),
});
