// middlewares/validarCategoria.js
import Joi from 'joi';

const validarCategoria = (req, res, next) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).max(100).required().messages({
      'any.required': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
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

export default validarCategoria;
