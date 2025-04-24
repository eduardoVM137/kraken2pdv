import Joi from 'joi';

const validarComponente = (req, res, next) => {
  const schema = Joi.object({
    idproducto: Joi.number().integer().positive().required().messages({
      'any.required': 'El producto es obligatorio',
      'number.base': 'El producto debe ser un número',
    }),
    idproducto_item: Joi.number().integer().positive().required().messages({
      'any.required': 'El producto item es obligatorio',
      'number.base': 'El producto item debe ser un número',
    }),
    cantidad: Joi.number().positive().required().messages({
      'any.required': 'La cantidad es obligatoria',
      'number.base': 'La cantidad debe ser un número',
      'number.positive': 'La cantidad debe ser mayor a 0',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarComponente;
