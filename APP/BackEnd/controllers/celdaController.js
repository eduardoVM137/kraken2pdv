import {
  mostrarCeldasService,
  insertarCeldaService,
  editarCeldaService,
  eliminarCeldaService,getUbicacionFisicaDetallada ,
} from "../services/celdaService.js";

export const mostrarCeldasController = async (req, res, next) => {
  try {
    const data = await mostrarCeldasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarCeldaController = async (req, res, next) => {
  try {
    const exito = await insertarCeldaService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarCeldaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarCeldaService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarCeldaController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarCeldaService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};
export async function getUbicacionFisicaCompleta(req, res) {
  try {
    const detalleProductoId = parseInt(req.params.id);
    if (isNaN(detalleProductoId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const ubicaciones = await getUbicacionFisicaDetallada(detalleProductoId);

    res.status(200).json({
      message: "Ubicaciones físicas detalladas obtenidas correctamente",
      data: ubicaciones
    });
  } catch (error) {
    console.error("Error en getUbicacionFisicaCompleta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}