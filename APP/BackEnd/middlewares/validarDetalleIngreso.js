import Joi from 'joi';

const validarDetalleIngreso = (req, res, next) => {
  const schema = Joi.object({
    idingreso: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID del ingreso es obligatorio',
      'number.base': 'El ID del ingreso debe ser un número',
      'number.positive': 'El ID del ingreso debe ser positivo',
    }),
    idproducto: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID del producto es obligatorio',
      'number.base': 'El ID del producto debe ser un número',
      'number.positive': 'El ID del producto debe ser positivo',
    }),
    cantidad: Joi.number().positive().required().messages({
      'any.required': 'La cantidad es obligatoria',
      'number.base': 'La cantidad debe ser un número',
      'number.positive': 'La cantidad debe ser mayor a 0',
    }),
    precio_costo: Joi.number().positive().required().messages({
      'any.required': 'El precio de costo es obligatorio',
      'number.base': 'El precio de costo debe ser un número',
      'number.positive': 'El precio de costo debe ser mayor a 0',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarDetalleIngreso;
