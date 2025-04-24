import Joi from 'joi';

const contenedorfiguraSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarContenedorFigura = (req, res, next) => {
  const { error } = contenedorfiguraSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarContenedorFigura;
export { contenedorfiguraSchema };