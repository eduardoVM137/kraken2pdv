import Joi from 'joi';

const validarIngreso = (req, res, next) => {
  const schema = Joi.object({
    idempleado: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID del empleado es obligatorio',
      'number.base': 'El ID del empleado debe ser un número',
      'number.positive': 'El ID del empleado debe ser positivo',
    }),
    idproveedor: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID del proveedor es obligatorio',
      'number.base': 'El ID del proveedor debe ser un número',
      'number.positive': 'El ID del proveedor debe ser positivo',
    }),
    idstate: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID del estado es obligatorio',
      'number.base': 'El ID del estado debe ser un número',
      'number.positive': 'El ID del estado debe ser positivo',
    }),
    fecha: Joi.date().required().messages({
      'any.required': 'La fecha es obligatoria',
      'date.base': 'La fecha debe ser válida',
    }),
    metodo_pago: Joi.string().max(50).required().messages({
      'any.required': 'El método de pago es obligatorio',
      'string.max': 'El método de pago no debe exceder 50 caracteres',
    }),
    comprobante: Joi.string().max(150).optional().messages({
      'string.max': 'El comprobante no debe exceder 150 caracteres',
    }),
    iva: Joi.number().min(0).required().messages({
      'any.required': 'El IVA es obligatorio',
      'number.base': 'El IVA debe ser un número',
      'number.min': 'El IVA no puede ser negativo',
    }),
    total: Joi.number().positive().required().messages({
      'any.required': 'El total es obligatorio',
      'number.base': 'El total debe ser un número',
      'number.positive': 'El total debe ser mayor a 0',
    }),
    pagado: Joi.string().max(50).optional().messages({
      'string.max': 'El campo pagado no debe exceder 50 caracteres',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarIngreso;
