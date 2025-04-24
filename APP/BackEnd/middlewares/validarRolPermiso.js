import Joi from 'joi';

const rolpermisoSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarRolPermiso = (req, res, next) => {
  const { error } = rolpermisoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarRolPermiso;
export { rolpermisoSchema };