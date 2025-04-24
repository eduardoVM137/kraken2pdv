import Joi from 'joi';

const detalleproductoceldaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarDetalleProductoCelda = (req, res, next) => {
  const { error } = detalleproductoceldaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarDetalleProductoCelda;
export { detalleproductoceldaSchema };