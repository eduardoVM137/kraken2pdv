import Joi from 'joi';

const empresaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarEmpresa = (req, res, next) => {
  const { error } = empresaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarEmpresa;
export { empresaSchema };