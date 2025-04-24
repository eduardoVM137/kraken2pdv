import Joi from 'joi';

const categoriaSchema = Joi.object({
    idcategoria: Joi.number().integer().required(),
    nombre: Joi.string().trim().max(100).required(),
    descripcion: Joi.string().trim().max(200).required()
});
const validarCategoria = (categoria) => {
    return categoriaSchema.validate(categoria);
};


const productoSchema = Joi.object({
    idproducto: Joi.number().integer(),
    idcategoria: Joi.number().integer(),
    nombre: Joi.string().max(50),
    precio_costo: Joi.number().precision(2),
    precio_venta: Joi.number().precision(2),
    tipo: Joi.string().max(50),
    idstate: Joi.number().integer(),
    presentacion: Joi.string().max(50),
    ubicacion: Joi.string().max(50),
    foto: Joi.string().allow(null, ''),
    codigo_barras:Joi.string().max(50),
    codigo_propio: Joi.string().max(50)
    // Añadir el resto de las validaciones para los campos del producto
});

const validarProducto = (producto) => {
    return productoSchema.validate(producto);
};

const clienteSchema = Joi.object({
    idempleado_usuario: Joi.number().integer(),
    idcliente: Joi.number().integer(),
    codigo_cliente: Joi.number().integer(),
    nombre: Joi.string().max(150).required(),
    apellidos: Joi.string().max(200).required(),
    // // Asume que 'foto' es un string base64 o una URL. Ajusta según sea necesario.
    foto: Joi.string().allow(null, ''),
    direccion: Joi.string().max(150).required(),
    telefono: Joi.string().max(50).required(),
    correo: Joi.string().email().required(),
    fecha_nacimiento: Joi.string().max(150).required(),
    comentarios: Joi.string().max(250).allow(null, ''),
    idstate: Joi.number().integer()
});

const validarCliente = (cliente) => {
    return clienteSchema.validate(cliente);
};


const proveedorSchema = Joi.object({
    idproveedor: Joi.number().integer(),
    idstate: Joi.number().integer(),
    codigo_proveedor: Joi.string().max(100),
    nombre: Joi.string().max(250),
    rfc: Joi.string().max(50).allow(null, ''),
    direccion: Joi.string().max(50),
    telefono: Joi.string().max(20).allow(null, ''),
    correo: Joi.string().email().allow(null, ''),
    comentarios: Joi.string().max(250).allow(null, ''),
    foto: Joi.string().allow(null, '') // asume que la foto es una cadena base64 o URL
});
const validarProveedor = (proveedor) => {
    return proveedorSchema.validate(proveedor);
};

const empleadoSchema = Joi.object({
    idempleado_usuario: Joi.number().integer(),
    idempleado: Joi.number().integer(),
    codigo_empleado: Joi.string().max(50).required(),
    nombre: Joi.string().max(150).required(),
    apellidos: Joi.string().max(200).required(),
    foto: Joi.string().allow('', null), // asume que la foto es una cadena base64 o URL
    direccion: Joi.string().max(50),
    telefono: Joi.string().max(50).required(),
    correo: Joi.string().email(),
    fecha_nacimiento: Joi.date().required(),
    comentarios: Joi.string().max(250).allow('', null),
    idstate: Joi.number().integer().required()
});
const validarEmpleado = (empleado) => {
    return empleadoSchema.validate(empleado);
};


const inventarioSchema = Joi.object({
    idinventario: Joi.number().integer(),
    idproducto: Joi.number().integer().required(),
    stock_actual: Joi.number().precision(2).required(), // Ajustar según la precisión necesaria
    stock_minimo: Joi.number().precision(2) // Ajustar según la precisión necesaria
});

const validarInventario = (inventario) => {
    return inventarioSchema.validate(inventario);
};

const componenteSchema = Joi.object({
    idcomponente: Joi.number().integer(),
    idproducto: Joi.number().integer().required(),
    idproducto_item: Joi.number().integer().required(),
    cantidad: Joi.number().precision(2).required() // Ajusta la precisión según sea necesario.
});

const validarComponente = (componente) => {
    return componenteSchema.validate(componente);
};

const corteCajaSchema = Joi.object({
    idcorte_caja: Joi.number().integer(),
    idempleado_usuario: Joi.number().integer().required(),
    fecha_hora_inicio: Joi.date().required(),
    fecha_hora_fin: Joi.date().required(),
    fondo_inicial: Joi.number().precision(2).required(),
    total_retiros: Joi.number().precision(2),
    total_ventas: Joi.number().precision(2).required(),
    total_entregado: Joi.number().precision(2).required()
});
const validarCorteCaja = (corteCaja) => {
    return corteCajaSchema.validate(corteCaja);
};
const detalleIngresoSchema = Joi.object({
    iddetalle_ingreso: Joi.number().integer(),
    idingreso: Joi.number().integer().required(),
    idproducto: Joi.number().integer().required(),
    cantidad: Joi.number().precision(2),
    precio_costo: Joi.number().precision(2)
});

const validarDetalleIngreso = (detalleIngreso) => {
    return detalleIngresoSchema.validate(detalleIngreso);
};
const detalleStateSchema = Joi.object({
    iddetalle_state: Joi.number().integer().required(),
    idstate: Joi.number().integer().required(),
    idempleado_usuario: Joi.number().integer().required(),
    fecha: Joi.date().required(),
    estado: Joi.string().valid('Activo', 'Inactivo').required() // Asegúrate de que estos valores coincidan con los que tu aplicación utiliza.
});

const validarDetalleState = (detalleState) => {
    return detalleStateSchema.validate(detalleState);
};

const detalleVentaSchema = Joi.object({
    iddetalle_venta: Joi.number().integer(),
    idventa: Joi.number().integer().required(),
    idproducto: Joi.number().integer().required(),
    idempleado: Joi.number().integer(),
    cantidad: Joi.number().required(),
    precio: Joi.number().precision(2).required(),
    descuento: Joi.number().precision(2).required(),
    subtotal: Joi.number().precision(2).required()
});

const validarDetalleVenta = (detalleVenta) => {
    return detalleVentaSchema.validate(detalleVenta);
};
const ingresoSchema = Joi.object({
    idingreso: Joi.number().integer(),
    idempleado: Joi.number().integer(),
    idempleado_usuario: Joi.number().integer(),
    idproveedor: Joi.number().integer().required(),
    idstate: Joi.number().integer(),
    fecha: Joi.date().required(),
    metodo_pago: Joi.string().max(50).required(),
    comprobante: Joi.string().max(150).allow('', null),
    iva: Joi.number().precision(2).required(),
    total: Joi.number().precision(2).required(),
    pagado: Joi.string().max(50).required()
});
const validarIngreso = (ingreso) => {
    return ingresoSchema.validate(ingreso);
};
const retiroSchema = Joi.object({
    idretiro: Joi.number().integer(),
    idempleado_usuario: Joi.number().integer(),
    idcorte_caja: Joi.number().integer(),
    fecha_hora: Joi.date().allow(null, ''),
    monto: Joi.number().precision(2),
    motivo: Joi.string().max(250).allow('', null)
});

const validarRetiro = (retiro) => {
    return retiroSchema.validate(retiro);
};

const subcategoriaSchema = Joi.object({
    idsub_categoria: Joi.number().integer(),
    idempleado_usuario: Joi.number().integer(),
    idcategoria: Joi.number().integer(),
    nombre: Joi.string().max(100),
    descripcion: Joi.string().max(200).allow('', null)
});

const validarSubcategoria = (subcategoria) => {
    return subcategoriaSchema.validate(subcategoria);
};
const ventaSchema = Joi.object({
    idventa: Joi.number().integer(),
    idempleado_usuario: Joi.number().integer(),
    idcliente: Joi.number().integer(),
    idstate: Joi.number().integer(),
    fecha: Joi.date().required(),
    metodo_pago: Joi.string().max(50).required(),
    comprobante: Joi.string().max(150).allow('', null),
    iva: Joi.number().precision(2).required(),
    total: Joi.number().precision(2).required(),
    pagado: Joi.string().max(50).required(),
    comentarios: Joi.string().max(250).allow('', null)
});

const validarVenta = (venta) => {
    return ventaSchema.validate(venta);
};


export {
    validarCategoria,
    validarProducto,
    validarCliente,
    validarProveedor,
    validarEmpleado,
    validarInventario,
    validarComponente,
    validarCorteCaja,
    validarDetalleIngreso,
    validarDetalleState,
    validarDetalleVenta,
    validarIngreso,
    validarRetiro,
    validarSubcategoria,
    validarVenta
};