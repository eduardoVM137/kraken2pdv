import Joi from 'joi';

const ubicacionfisicaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarUbicacionFisica = (req, res, next) => {
  const { error } = ubicacionfisicaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarUbicacionFisica;
export { ubicacionfisicaSchema };