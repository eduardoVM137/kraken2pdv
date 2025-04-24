import Joi from 'joi';

const productoSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarProducto = (req, res, next) => {
  const { error } = productoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarProducto;
export { productoSchema };