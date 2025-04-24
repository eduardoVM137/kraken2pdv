import Joi from 'joi';

const configuracionnegocioSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarConfiguracionNegocio = (req, res, next) => {
  const { error } = configuracionnegocioSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarConfiguracionNegocio;
export { configuracionnegocioSchema };