import Joi from 'joi';

const validarCorteCaja = (req, res, next) => {
  const schema = Joi.object({
    idempleado_usuario: Joi.number().integer().positive().required().messages({
      'any.required': 'El empleado usuario es obligatorio',
      'number.base': 'El empleado usuario debe ser un número',
    }),
    fecha_hora_inicio: Joi.date().required().messages({
      'any.required': 'La fecha y hora de inicio son obligatorias',
      'date.base': 'La fecha de inicio debe ser válida',
    }),
    fecha_hora_fin: Joi.date().required().messages({
      'any.required': 'La fecha y hora de fin son obligatorias',
      'date.base': 'La fecha de fin debe ser válida',
    }),
    fondo_inicial: Joi.number().positive().required().messages({
      'any.required': 'El fondo inicial es obligatorio',
      'number.base': 'El fondo inicial debe ser un número',
      'number.positive': 'El fondo inicial debe ser mayor a 0',
    }),
    total_retiros: Joi.number().positive().required().messages({
      'any.required': 'El total de retiros es obligatorio',
      'number.base': 'El total de retiros debe ser un número',
      'number.positive': 'El total de retiros debe ser mayor a 0',
    }),
    total_ventas: Joi.number().positive().required().messages({
      'any.required': 'El total de ventas es obligatorio',
      'number.base': 'El total de ventas debe ser un número',
      'number.positive': 'El total de ventas debe ser mayor a 0',
    }),
    total_entregado: Joi.number().positive().required().messages({
      'any.required': 'El total entregado es obligatorio',
      'number.base': 'El total entregado debe ser un número',
      'number.positive': 'El total entregado debe ser mayor a 0',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarCorteCaja;
