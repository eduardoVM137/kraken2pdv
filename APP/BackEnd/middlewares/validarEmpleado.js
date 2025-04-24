import Joi from 'joi';

const empleadoSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarEmpleado = (req, res, next) => {
  const { error } = empleadoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarEmpleado;
export { empleadoSchema };