import Joi from 'joi';

const configuracionextrajsonSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarConfiguracionExtraJson = (req, res, next) => {
  const { error } = configuracionextrajsonSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarConfiguracionExtraJson;
export { configuracionextrajsonSchema };