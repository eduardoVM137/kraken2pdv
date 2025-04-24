// // --- usuarioController.js ---
// import {
//   mostrarUsuariosService,
//   insertarUsuarioService,
//   editarUsuarioService,
//   eliminarUsuarioService,
// } from "../services/usuarioService.js";

// export const mostrarUsuariosController = async (req, res, next) => {
//   try {
//     const data = await mostrarUsuariosService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarUsuarioController = async (req, res, next) => {
//   try {
//     const exito = await insertarUsuarioService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarUsuarioController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarUsuarioService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarUsuarioController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarUsuarioService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// --- rolController.js ---
// import {
//   mostrarRolsService,
//   insertarRolService,
//   editarRolService,
//   eliminarRolService,
// } from "../services/rolService.js";

// export const mostrarRolsController = async (req, res, next) => {
//   try {
//     const data = await mostrarRolsService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarRolController = async (req, res, next) => {
//   try {
//     const exito = await insertarRolService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarRolController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarRolService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarRolController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarRolService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// --- usuario_rolController.js ---
// import {
//   mostrarUsuarioRolsService,
//   insertarUsuarioRolService,
//   editarUsuarioRolService,
//   eliminarUsuarioRolService,
// } from "../services/usuario_rolService.js";

// export const mostrarUsuarioRolsController = async (req, res, next) => {
//   try {
//     const data = await mostrarUsuarioRolsService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarUsuarioRolController = async (req, res, next) => {
//   try {
//     const exito = await insertarUsuarioRolService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarUsuarioRolController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarUsuarioRolService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarUsuarioRolController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarUsuarioRolService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// // --- rol_permisoController.js ---
// import {
//   mostrarRolPermisosService,
//   insertarRolPermisoService,
//   editarRolPermisoService,
//   eliminarRolPermisoService,
// } from "../services/rol_permisoService.js";

// export const mostrarRolPermisosController = async (req, res, next) => {
//   try {
//     const data = await mostrarRolPermisosService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarRolPermisoController = async (req, res, next) => {
//   try {
//     const exito = await insertarRolPermisoService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarRolPermisoController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarRolPermisoService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarRolPermisoController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarRolPermisoService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// // --- areaController.js ---
// import {
//   mostrarAreasService,
//   insertarAreaService,
//   editarAreaService,
//   eliminarAreaService,
// } from "../services/areaService.js";

// export const mostrarAreasController = async (req, res, next) => {
//   try {
//     const data = await mostrarAreasService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarAreaController = async (req, res, next) => {
//   try {
//     const exito = await insertarAreaService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarAreaController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarAreaService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarAreaController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarAreaService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// // --- accionController.js ---
// import {
//   mostrarAccionsService,
//   insertarAccionService,
//   editarAccionService,
//   eliminarAccionService,
// } from "../services/accionService.js";

// export const mostrarAccionsController = async (req, res, next) => {
//   try {
//     const data = await mostrarAccionsService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarAccionController = async (req, res, next) => {
//   try {
//     const exito = await insertarAccionService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarAccionController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarAccionService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarAccionController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarAccionService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// // --- restriccion_usuarioController.js ---
// import {
//   mostrarRestriccionUsuariosService,
//   insertarRestriccionUsuarioService,
//   editarRestriccionUsuarioService,
//   eliminarRestriccionUsuarioService,
// } from "../services/restriccion_usuarioService.js";

// export const mostrarRestriccionUsuariosController = async (req, res, next) => {
//   try {
//     const data = await mostrarRestriccionUsuariosService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarRestriccionUsuarioController = async (req, res, next) => {
//   try {
//     const exito = await insertarRestriccionUsuarioService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarRestriccionUsuarioController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarRestriccionUsuarioService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarRestriccionUsuarioController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarRestriccionUsuarioService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// // --- log_accesoController.js ---
// import {
//   mostrarLogAccesosService,
//   insertarLogAccesoService,
//   editarLogAccesoService,
//   eliminarLogAccesoService,
// } from "../services/log_accesoService.js";

// export const mostrarLogAccesosController = async (req, res, next) => {
//   try {
//     const data = await mostrarLogAccesosService();
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };

// export const insertarLogAccesoController = async (req, res, next) => {
//   try {
//     const exito = await insertarLogAccesoService(req.body);
//     res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const editarLogAccesoController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await editarLogAccesoService(id, req.body);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const eliminarLogAccesoController = async (req, res, next) => {
//   try {
//     const id = Number(req.params.id);
//     const exito = await eliminarLogAccesoService(id);
//     res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
//   } catch (error) {
//     next(error);
//   }
// };