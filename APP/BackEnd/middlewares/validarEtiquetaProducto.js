import Joi from 'joi';

const etiquetaproductoSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarEtiquetaProducto = (req, res, next) => {
  const { error } = etiquetaproductoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarEtiquetaProducto;
export { etiquetaproductoSchema };