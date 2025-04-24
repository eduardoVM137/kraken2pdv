import Joi from 'joi';

const validarProducto = (req, res, next) => {
    const schema = Joi.object({
        idcategoria: Joi.number().integer().positive().required().messages({
            'any.required': 'La categoría es obligatoria',
            'number.base': 'La categoría debe ser un número',
        }),
        nombre: Joi.string().min(3).max(255).required().messages({
            'any.required': 'El nombre es obligatorio',
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no debe exceder 255 caracteres',
        }),
        precio_costo: Joi.number().positive().required().messages({
            'any.required': 'El precio de costo es obligatorio',
            'number.base': 'El precio de costo debe ser un número',
            'number.positive': 'El precio de costo debe ser mayor a 0',
        }),
        precio_venta: Joi.number().positive().required().messages({
            'any.required': 'El precio de venta es obligatorio',
            'number.base': 'El precio de venta debe ser un número',
            'number.positive': 'El precio de venta debe ser mayor a 0',
        }),
        tipo: Joi.number().integer().required().messages({
            'any.required': 'El tipo es obligatorio',
            'number.base': 'El tipo debe ser un número',
        }),
        idstate: Joi.number().integer().required().messages({
            'any.required': 'El estado es obligatorio',
            'number.base': 'El estado debe ser un número',
        }),
        presentacion: Joi.string().max(255).optional().messages({
            'string.max': 'La presentación no debe exceder 255 caracteres',
        }),
        ubicacion: Joi.string().max(255).optional().messages({
            'string.max': 'La ubicación no debe exceder 255 caracteres',
        }),
        foto: Joi.string().max(255).optional().messages({
            'string.max': 'La foto no debe exceder 255 caracteres',
        }),
        codigo_barras: Joi.string().max(255).optional().messages({
            'string.max': 'El código de barras no debe exceder 255 caracteres',
        }),
        codigo_propio: Joi.string().max(255).optional().messages({
            'string.max': 'El código propio no debe exceder 255 caracteres',
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export default validarProducto;
