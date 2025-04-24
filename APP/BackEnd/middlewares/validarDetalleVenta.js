import Joi from 'joi';

const validarDetalleVenta = (req, res, next) => {
  const schema = Joi.object({
    idventa: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID de la venta es obligatorio',
      'number.base': 'El ID de la venta debe ser un número',
      'number.positive': 'El ID de la venta debe ser positivo',
    }),
    idempleado: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID del empleado es obligatorio',
      'number.base': 'El ID del empleado debe ser un número',
      'number.positive': 'El ID del empleado debe ser positivo',
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
    precio: Joi.number().positive().required().messages({
      'any.required': 'El precio es obligatorio',
      'number.base': 'El precio debe ser un número',
      'number.positive': 'El precio debe ser mayor a 0',
    }),
    descuento: Joi.number().min(0).required().messages({
      'any.required': 'El descuento es obligatorio',
      'number.base': 'El descuento debe ser un número',
      'number.min': 'El descuento no puede ser negativo',
    }),
    subtotal: Joi.number().positive().required().messages({
      'any.required': 'El subtotal es obligatorio',
      'number.base': 'El subtotal debe ser un número',
      'number.positive': 'El subtotal debe ser mayor a 0',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarDetalleVenta;
