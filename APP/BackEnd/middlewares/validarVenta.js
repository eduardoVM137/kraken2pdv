import Joi from 'joi';

const ventaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarVenta = (req, res, next) => {
  const { error } = ventaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarVenta;
export { ventaSchema };