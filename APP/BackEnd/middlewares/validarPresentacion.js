import Joi from 'joi';

// 📌 Usado cuando ya existe el detalle_producto
export const presentacionSchemaObligatorio = Joi.object({
  detalle_producto_id: Joi.number().integer().required().messages({
    'number.base': 'El ID del detalle de producto debe ser un número',
    'any.required': 'El ID del detalle de producto es obligatorio',
  }),
  nombre: Joi.string().max(100).required().messages({
    'string.base': 'El nombre debe ser un texto',
    'string.max': 'El nombre no debe exceder 100 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  cantidad: Joi.number().precision(2).required().messages({
    'number.base': 'La cantidad debe ser un número',
    'any.required': 'La cantidad es obligatoria',
  }),
  descripcion: Joi.string().max(255).optional().allow(null, '').messages({
    'string.base': 'La descripción debe ser un texto',
    'string.max': 'La descripción no debe exceder 255 caracteres',
  }),
  // 🔥 Nuevos campos:
  alias: Joi.string().max(200).optional().allow(null, '').messages({
    'string.base': 'El alias debe ser un texto',
    'string.max': 'El alias no debe exceder 200 caracteres',
  }),
  visible: Joi.boolean().optional().default(true).messages({
    'boolean.base': 'El campo visible debe ser booleano',
  }),
});

// 📌 Usado cuando apenas estamos creando junto a detalle_producto
export const presentacionSchemaOpcional = Joi.object({
  detalle_producto_id: Joi.number().integer().optional().allow(null),
  nombre: Joi.string().max(100).required().messages({
    'string.base': 'El nombre debe ser un texto',
    'string.max': 'El nombre no debe exceder 100 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  cantidad: Joi.number().precision(2).required().messages({
    'number.base': 'La cantidad debe ser un número',
    'any.required': 'La cantidad es obligatoria',
  }),
  descripcion: Joi.string().max(255).optional().allow(null, '').messages({
    'string.base': 'La descripción debe ser un texto',
    'string.max': 'La descripción no debe exceder 255 caracteres',
  }),
  // 🔥 Nuevos campos:
  alias: Joi.string().max(200).optional().allow(null, '').messages({
    'string.base': 'El alias debe ser un texto',
    'string.max': 'El alias no debe exceder 200 caracteres',
  }),
  visible: Joi.boolean().optional().default(true).messages({
    'boolean.base': 'El campo visible debe ser booleano',
  }),  
  idVirtualPresentacion: Joi.string().optional(), // <<<<< Nuevo
});

