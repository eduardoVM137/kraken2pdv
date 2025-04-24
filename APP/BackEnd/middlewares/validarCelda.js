import Joi from 'joi';

const celdaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarCelda = (req, res, next) => {
  const { error } = celdaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarCelda;
export { celdaSchema };