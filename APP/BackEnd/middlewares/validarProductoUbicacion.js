import Joi from 'joi';

const productoubicacionSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarProductoUbicacion = (req, res, next) => {
  const { error } = productoubicacionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarProductoUbicacion;
export { productoubicacionSchema };