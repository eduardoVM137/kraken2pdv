import Joi from 'joi';

const contenedorinstanciaSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarContenedorInstancia = (req, res, next) => {
  const { error } = contenedorinstanciaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarContenedorInstancia;
export { contenedorinstanciaSchema };