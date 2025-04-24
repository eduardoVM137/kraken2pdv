import {
  mostrarCategoriasService,
  insertarCategoriaService,
  editarCategoriaService,
  eliminarCategoriaService,
} from "../services/categoriaService.js";

// 🔹 Mostrar categorías
 

  export const mostrarCategoriasController = async (req, res, next) => {
    try {
      const data = await mostrarCategoriasService();
      return res.status(200).json({ message: "Categorias encontradas", data });
    } catch (error) {
      next(error);
    }
  };


// 🔹 Insertar categoría
export const insertarCategoriaController = async (req, res, next) => {
  try {
    const resultado = await insertarCategoriaService(req.body);
    if (!resultado) return res.status(400).json({ message: "No se pudo crear la categoría" });

    res.status(201).json({ message: "Categoría creada correctamente", data: resultado });
  } catch (error) {
    next(error);
  }
};

// 🔹 Editar categoría
export const editarCategoriaController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await editarCategoriaService(Number(id), req.body);
    if (!resultado) return res.status(404).json({ message: "Categoría no encontrada" });

    res.status(200).json({ message: "Categoría actualizada", data: resultado });
  } catch (error) {
    next(error);
  }
};

// 🔹 Eliminar categoría
export const eliminarCategoriaController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await eliminarCategoriaService(Number(id));
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
  