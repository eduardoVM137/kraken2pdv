import Joi from 'joi';

const accesoSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarAcceso = (req, res, next) => {
  const { error } = accesoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarAcceso;
export { accesoSchema };