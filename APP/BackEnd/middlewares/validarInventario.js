import Joi from 'joi';

const validarInventario = (req, res, next) => {
  const schema = Joi.object({
    idproducto: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID del producto es obligatorio',
      'number.base': 'El ID del producto debe ser un número',
      'number.positive': 'El ID del producto debe ser positivo',
    }),
    stock_actual: Joi.number().min(0).required().messages({
      'any.required': 'El stock actual es obligatorio',
      'number.base': 'El stock actual debe ser un número',
      'number.min': 'El stock actual no puede ser negativo',
    }),
    stock_minimo: Joi.number().min(0).required().messages({
      'any.required': 'El stock mínimo es obligatorio',
      'number.base': 'El stock mínimo debe ser un número',
      'number.min': 'El stock mínimo no puede ser negativo',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarInventario;
