import Joi from 'joi';

const usuariorolSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarUsuarioRol = (req, res, next) => {
  const { error } = usuariorolSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarUsuarioRol;
export { usuariorolSchema };