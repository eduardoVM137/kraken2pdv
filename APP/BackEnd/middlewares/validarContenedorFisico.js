import Joi from 'joi';

const contenedorfisicoSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarContenedorFisico = (req, res, next) => {
  const { error } = contenedorfisicoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarContenedorFisico;
export { contenedorfisicoSchema };