import Joi from 'joi';

const rolSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarRol = (req, res, next) => {
  const { error } = rolSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarRol;
export { rolSchema };