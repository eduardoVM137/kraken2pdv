import Joi from 'joi';

const detalleingresoSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarDetalleIngreso = (req, res, next) => {
  const { error } = detalleingresoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarDetalleIngreso;
export { detalleingresoSchema };