import Joi from 'joi';

const negocioSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarNegocio = (req, res, next) => {
  const { error } = negocioSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarNegocio;
export { negocioSchema };