import express from 'express';
import productoRoutes from './Routes/productoRoutes.js';
import categoriaRoutes from './Routes/categoriaRoutes.js';
import proveedorRoutes from './Routes/proveedorRoutes.js';
import retiroRoutes from './Routes/retiroRoutes.js';
import stateRoutes from './Routes/stateRoutes.js';
import subCategoriaRoutes from './Routes/subCategoriaRoutes.js';
import ventaRoutes from './Routes/ventaRoutes.js';
import detalleIngresoRoutes from './Routes/detalle_ingresoRoutes.js';
import detalleStateRoutes from './Routes/detalleStateRoutes.js';
import detalleVentaRoutes from './Routes/detalle_ventaRoutes.js';
import empleadoRoutes from './Routes/empleadoRoutes.js';
import ingresoRoutes from './Routes/ingresoRoutes.js';
import inventarioRoutes from './Routes/inventarioRoutes.js';
import componenteRoutes from './Routes/componenteRoutes.js';
import corteCajaRoutes from './Routes/corteCajaRoutes.js';
import detalle_Producto_Routes from './Routes/detalle_Producto_Routes.js';
//import accesoRoutes from './Routes/accesoRoutes.js';
import presentacionRoutes from './Routes/presentacionRoutes.js';
import atributoRoutes from './Routes/atributoRoutes.js';
import etiqueta_productoRoutes from './Routes/etiquetaProductoRoutes.js';
import precioRoutes from './Routes/precioRoutes.js';
import ubicacionRoutes from './Routes/ubicacion_fisicaRoutes.js';
import contenedor_fisicoRoutes from './Routes/contenedor_fisicoRoutes.js';
import contenedor_instanciaRoutes from './Routes/contenedor_instanciaRoutes.js';
import detalle_producto_celdaRoutes from './Routes/detalle_producto_celdaRoutes.js';
import producto_ubicacionRoutes from './Routes/producto_ubicacionRoutes.js';
import celdaRoutes from './Routes/celdaRoutes.js';
import tipo_contenedorRoutes from './Routes/tipo_contenedorRoutes.js';
import clienteRoutes from './Routes/clienteRoutes.js';
import detalle_ventaRoutes from './Routes/detalle_ventaRoutes.js';
import empresaRoutes from './Routes/empresaRoutes.js';
import negocioRoutes from './Routes/negocioRoutes.js';
import configuracion_negocioRoutes from './Routes/configuracion_negocioRoutes.js';
import licencia_empresaRoutes from './Routes/licencia_empresaRoutes.js';
import pago_empresaRoutes from './Routes/pago_empresaRoutes.js';
import modulo_empresaRoutes from './Routes/modulo_empresaRoutes.js';
import configuracion_extra_jsonRoutes from './Routes/configuracion_extra_jsonRoutes.js';
import contenedor_figuraRoutes from './Routes/contenedor_figuraRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());

// Rutas
app.use('/api/producto', productoRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/retiro', retiroRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/subcategoria', subCategoriaRoutes);
app.use('/api/venta', ventaRoutes);
app.use('/api/detalle-ingreso', detalleIngresoRoutes);
app.use('/api/detalle-state', detalleStateRoutes);
app.use('/api/detalle-venta', detalleVentaRoutes);
app.use('/api/empleado', empleadoRoutes);
app.use('/api/ingreso', ingresoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/componente', componenteRoutes);
app.use('/api/cortecaja', corteCajaRoutes);
app.use('/api/detalle-producto', detalle_Producto_Routes);
//app.use('/api/acceso', accesoRoutes);
app.use('/api/presentacion', presentacionRoutes);
app.use('/api/atributo', atributoRoutes);
app.use('/api/etiqueta-producto', etiqueta_productoRoutes);
app.use('/api/precio', precioRoutes);
app.use('/api/ubicacion', ubicacionRoutes);
app.use('/api/contenedor-fisico', contenedor_fisicoRoutes);
app.use('/api/contenedor-instancia', contenedor_instanciaRoutes);
app.use('/api/detalle-producto-celda', detalle_producto_celdaRoutes);
app.use('/api/producto-ubicacion', producto_ubicacionRoutes);
app.use('/api/celda', celdaRoutes);
app.use('/api/tipo-contenedor', tipo_contenedorRoutes);
app.use('/api/cliente', clienteRoutes); 
app.use('/api/detalle-venta', detalle_ventaRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/venta', ventaRoutes);
app.use('/api/empresa', empresaRoutes);
app.use('/api/negocio', negocioRoutes);
app.use('/api/configuracion-negocio', configuracion_negocioRoutes);
app.use('/api/licencia-empresa', licencia_empresaRoutes);
app.use('/api/pago-empresa', pago_empresaRoutes);
app.use('/api/modulo-empresa', modulo_empresaRoutes);
app.use('/api/configuracion-extra-json', configuracion_extra_jsonRoutes);
app.use('/api/contenedor-figura', contenedor_figuraRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;