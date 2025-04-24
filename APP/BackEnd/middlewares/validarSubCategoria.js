import Joi from 'joi';

const subcategoriaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarSubCategoria = (req, res, next) => {
  const { error } = subcategoriaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarSubCategoria;
export { subcategoriaSchema };