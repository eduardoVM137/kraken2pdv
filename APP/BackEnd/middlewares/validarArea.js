import Joi from 'joi';

const areaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarArea = (req, res, next) => {
  const { error } = areaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarArea;
export { areaSchema };