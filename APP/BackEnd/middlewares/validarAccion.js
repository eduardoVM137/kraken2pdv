import Joi from 'joi';

const accionSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarAccion = (req, res, next) => {
  const { error } = accionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarAccion;
export { accionSchema };