import Joi from 'joi';

const componenteSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarComponente = (req, res, next) => {
  const { error } = componenteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarComponente;
export { componenteSchema };