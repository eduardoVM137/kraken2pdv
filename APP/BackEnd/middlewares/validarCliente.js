// middlewares/validarCliente.js
import Joi from 'joi';

const validarCliente = (req, res, next) => {
  const schema = Joi.object({
    codigo_cliente: Joi.string().max(50).optional().messages({
      'string.max': 'El código del cliente no debe exceder 50 caracteres',
    }),
    nombre: Joi.string().min(3).max(150).required().messages({
      'any.required': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no debe exceder 150 caracteres',
    }),
    apellidos: Joi.string().max(200).optional().messages({
      'string.max': 'Los apellidos no deben exceder 200 caracteres',
    }),
    direccion: Joi.string().max(150).optional().messages({
      'string.max': 'La dirección no debe exceder 150 caracteres',
    }),
    telefono: Joi.string().max(50).optional().messages({
      'string.max': 'El teléfono no debe exceder 50 caracteres',
    }),
    correo: Joi.string().email().max(150).optional().messages({
      'string.email': 'El correo debe ser válido',
      'string.max': 'El correo no debe exceder 150 caracteres',
    }),
    fecha_nacimiento: Joi.date().optional().messages({
      'date.base': 'La fecha de nacimiento debe ser válida',
    }),
    comentarios: Joi.string().max(250).optional().messages({
      'string.max': 'Los comentarios no deben exceder 250 caracteres',
    }),
    foto: Joi.any().optional(), // Depende de cómo manejes la foto en el backend
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validarCliente;
