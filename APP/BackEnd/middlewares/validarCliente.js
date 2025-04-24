import Joi from 'joi';

const clienteSchema = Joi.object({
  // TODO: define aquí los campos según el modelo
});

const validarCliente = (req, res, next) => {
  const { error } = clienteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ errores });
  }
  next();
};

export default validarCliente;
export { clienteSchema };