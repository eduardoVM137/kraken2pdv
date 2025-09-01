// validators/validarProveedor.js
import Joi from 'joi';

const proveedorSchema = Joi.object({
  nombre: Joi.string().max(150).required().messages({
    "string.base": "El nombre debe ser texto",
    "any.required": "El nombre es obligatorio",
  }),
  contacto: Joi.string().max(100).allow(null, ""),
  telefono: Joi.string().max(20).allow(null, ""),
  direccion: Joi.string().allow(null, ""),
  state_id: Joi.number().integer().allow(null),
  codigo_proveedor: Joi.string().max(100).allow(null, ""),
  rfc: Joi.string().max(50).allow(null, ""),
  foto: Joi.string().max(255).allow(null, ""),
  estado: Joi.boolean().allow(null),
});
 
 

export { proveedorSchema };