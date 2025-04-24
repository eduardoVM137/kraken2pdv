import Joi from 'joi';

const validarProveedor = (req, res, next) => {
  const schema = Joi.object({
    codigo_proveedor: Joi.string().max(100).optional().messages({
      'string.max': 'El código del proveedor no debe exceder 100 caracteres',
    }),
    nombre: Joi.string().max(250).required().messages({
      'any.required': 'El nombre es obligatorio',
      'string.max': 'El nombre no debe exceder 250 caracteres',
    }),
    rfc: Joi.string().max(50).optional().messages({
      'string.max': 'El RFC no debe exceder 50 caracteres',
    }),
    direccion: Joi.string().max(50).optional().messages({
      'string.max': 'La dirección no debe exceder 50 caracteres',
    }),
    telefono: Joi.string().max(20).optional().messages({
      'string.max': 'El teléfono no debe exceder 20 caracteres',
    }),
    correo: Joi.string().email().max(150).optional().messages({
      'string.email': 'El correo debe ser válido',
      'string.max': 'El correo no debe exceder 150 caracteres',
    }),
    comentarios: Joi.string().max(250).optional().messages({
      'string.max': 'Los comentarios no deben exceder 250 caracteres',
    }),
    foto: Joi.any().optional(), // Dependerá de cómo manejes la foto
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarProveedor;
