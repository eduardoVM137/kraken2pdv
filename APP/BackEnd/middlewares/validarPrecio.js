import Joi from 'joi';

const precioSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarPrecio = (req, res, next) => {
  const { error } = precioSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarPrecio;
export { precioSchema };