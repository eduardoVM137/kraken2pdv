
// controllers/productoController.js

import { insertarProductoService , mostrarProductosService } from '../services/productoService.js';

export const insertarProductoController = async (req, res, next) => {
    try {
        const miProducto = await insertarProductoService(req.body);
        res.status(201).json(miProducto);
    } catch (error) {
        next(error);  
    }
};


export const mostrarProductosController = async (req, res, next) => {
    try {
        const jsonProductos = await mostrarProductosService();
        res.json(jsonProductos);
    } catch (error) {
        next(error); 
    }
};
