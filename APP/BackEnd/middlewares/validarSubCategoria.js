import Joi from 'joi';

const validarSubCategoria = (req, res, next) => {
  const schema = Joi.object({
    idcategoria: Joi.number().integer().positive().required().messages({
      'any.required': 'El ID de la categoría es obligatorio',
      'number.base': 'El ID de la categoría debe ser un número',
      'number.positive': 'El ID de la categoría debe ser positivo',
    }),
    nombre: Joi.string().max(100).required().messages({
      'any.required': 'El nombre es obligatorio',
      'string.max': 'El nombre no debe exceder 100 caracteres',
    }),
    descripcion: Joi.string().max(200).optional().messages({
      'string.max': 'La descripción no debe exceder 200 caracteres',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarSubCategoria;
