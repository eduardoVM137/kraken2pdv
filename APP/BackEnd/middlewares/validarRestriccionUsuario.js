import Joi from 'joi';

const restriccionusuarioSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarRestriccionUsuario = (req, res, next) => {
  const { error } = restriccionusuarioSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarRestriccionUsuario;
export { restriccionusuarioSchema };