import Joi from 'joi';

const movimientoStockSchema = Joi.object({
  tipo_movimiento: Joi.string()
    .valid('ajuste_inicial', 'compra', 'venta', 'salida', 'entrada', 'corrección', 'traslado')
    .required()
    .messages({
      'any.required': 'El tipo de movimiento es obligatorio',
      'any.only': 'Tipo de movimiento no válido',
    }),

  empresa_id: Joi.number().integer().required().messages({
    'number.base': 'La empresa debe ser un número',
    'any.required': 'El ID de empresa es obligatorio',
  }),

  producto_id: Joi.number().integer().required().messages({
    'number.base': 'El producto debe ser un número',
    'any.required': 'El ID de producto es obligatorio',
  }),

  detalle_producto_id: Joi.number().integer().required().messages({
    'number.base': 'El detalle de producto debe ser un número',
    'any.required': 'El ID de detalle_producto es obligatorio',
  }),

  cantidad: Joi.number().precision(2).when('tipo_movimiento', {
    is: Joi.valid('ajuste_inicial', 'compra', 'entrada', 'salida', 'venta'),
    then: Joi.required().messages({
      'any.required': 'La cantidad es obligatoria para este tipo de movimiento',
    }),
    otherwise: Joi.optional(),
  }),

  precio_costo: Joi.number().precision(2).when('tipo_movimiento', {
    is: Joi.valid('ajuste_inicial', 'compra'),
    then: Joi.required().messages({
      'any.required': 'El precio de costo es obligatorio para este tipo de movimiento',
    }),
    otherwise: Joi.optional(),
  }),

  ubicacion_id: Joi.number().integer().when('tipo_movimiento', {
    is: Joi.valid('ajuste_inicial', 'compra', 'entrada', 'salida', 'venta'),
    then: Joi.required().messages({
      'any.required': 'La ubicación es obligatoria para este tipo de movimiento',
    }),
    otherwise: Joi.optional(),
  }),

  motivo: Joi.string().max(255).optional(),

  usuario_id: Joi.number().integer().allow(null).optional(),

  ubicacion_origen_id: Joi.number().integer().when('tipo_movimiento', {
    is: 'traslado',
    then: Joi.required().messages({
      'any.required': 'La ubicación origen es obligatoria en traslados',
    }),
    otherwise: Joi.optional(),
  }),

  ubicacion_destino_id: Joi.number().integer().when('tipo_movimiento', {
    is: 'traslado',
    then: Joi.required().messages({
      'any.required': 'La ubicación destino es obligatoria en traslados',
    }),
    otherwise: Joi.optional(),
  }),

  referencia_id: Joi.number().integer().allow(null).optional(),
  referencia_tipo: Joi.string().max(50).allow(null).optional(),
});

export default movimientoStockSchema;
