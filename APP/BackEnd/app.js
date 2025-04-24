import express from 'express';
import productoRoutes from './Routes/productoRoutes.js';
import categoriaRoutes from './Routes/categoriaRoutes.js';
import proveedorRoutes from './Routes/proveedorRoutes.js';
import retiroRoutes from './Routes/retiroRoutes.js';
import stateRoutes from './Routes/stateRoutes.js';
import subCategoriaRoutes from './Routes/subCategoriaRoutes.js';
import ventaRoutes from './Routes/ventaRoutes.js';
import detalleIngresoRoutes from './Routes/detalleIngresoRoutes.js';
import detalleStateRoutes from './Routes/detalleStateRoutes.js';
import detalleVentaRoutes from './Routes/detalleVentaRoutes.js';
import empleadoRoutes from './Routes/empleadoRoutes.js';
import ingresoRoutes from './Routes/ingresoRoutes.js';
import inventarioRoutes from './Routes/inventarioRoutes.js';
import componenteRoutes from './Routes/componenteRoutes.js';
import corteCajaRoutes from './Routes/corteCajaRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/retiros', retiroRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/subcategorias', subCategoriaRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/detalleingresos', detalleIngresoRoutes);
app.use('/api/detallestates', detalleStateRoutes);
app.use('/api/detalleventas', detalleVentaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/inventarios', inventarioRoutes);
app.use('/api/componentes', componenteRoutes);
app.use('/api/cortecajas', corteCajaRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
