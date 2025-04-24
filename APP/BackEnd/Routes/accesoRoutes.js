import express from "express";
const router = express.Router();

// --- Usuario ---
import {
  mostrarUsuariosController,
  insertarUsuarioController,
  editarUsuarioController,
  eliminarUsuarioController,
} from "../controllers/accesoController.js";

router.get("/usuarios", mostrarUsuariosController);
router.post("/usuarios", insertarUsuarioController);
router.put("/usuarios/:id", editarUsuarioController);
router.delete("/usuarios/:id", eliminarUsuarioController);

// --- Rol ---
import {
  mostrarRolsController,
  insertarRolController,
  editarRolController,
  eliminarRolController,
} from "../controllers/accesoController.js";

router.get("/roles", mostrarRolsController);
router.post("/roles", insertarRolController);
router.put("/roles/:id", editarRolController);
router.delete("/roles/:id", eliminarRolController);

// --- UsuarioRol ---
import {
  mostrarUsuarioRolsController,
  insertarUsuarioRolController,
  editarUsuarioRolController,
  eliminarUsuarioRolController,
} from "../controllers/accesoController.js";

router.get("/usuario-rol", mostrarUsuarioRolsController);
router.post("/usuario-rol", insertarUsuarioRolController);
router.put("/usuario-rol/:id", editarUsuarioRolController);
router.delete("/usuario-rol/:id", eliminarUsuarioRolController);

// --- RolPermiso ---
import {
  mostrarRolPermisosController,
  insertarRolPermisoController,
  editarRolPermisoController,
  eliminarRolPermisoController,
} from "../controllers/accesoController.js";

router.get("/rol-permiso", mostrarRolPermisosController);
router.post("/rol-permiso", insertarRolPermisoController);
router.put("/rol-permiso/:id", editarRolPermisoController);
router.delete("/rol-permiso/:id", eliminarRolPermisoController);

// --- Area ---
import {
  mostrarAreasController,
  insertarAreaController,
  editarAreaController,
  eliminarAreaController,
} from "../controllers/accesoController.js";

router.get("/areas", mostrarAreasController);
router.post("/areas", insertarAreaController);
router.put("/areas/:id", editarAreaController);
router.delete("/areas/:id", eliminarAreaController);

// --- Accion ---
import {
  mostrarAccionsController,
  insertarAccionController,
  editarAccionController,
  eliminarAccionController,
} from "../controllers/accesoController.js";

router.get("/acciones", mostrarAccionsController);
router.post("/acciones", insertarAccionController);
router.put("/acciones/:id", editarAccionController);
router.delete("/acciones/:id", eliminarAccionController);

// --- RestriccionUsuario ---
import {
  mostrarRestriccionUsuariosController,
  insertarRestriccionUsuarioController,
  editarRestriccionUsuarioController,
  eliminarRestriccionUsuarioController,
} from "../controllers/accesoController.js";

router.get("/restricciones", mostrarRestriccionUsuariosController);
router.post("/restricciones", insertarRestriccionUsuarioController);
router.put("/restricciones/:id", editarRestriccionUsuarioController);
router.delete("/restricciones/:id", eliminarRestriccionUsuarioController);

// --- LogAcceso ---
import {
  mostrarLogAccesosController,
  insertarLogAccesoController,
  eliminarLogAccesoController,
} from "../controllers/accesoController.js";

router.get("/log-accesos", mostrarLogAccesosController);
router.post("/log-accesos", insertarLogAccesoController);
router.delete("/log-accesos/:id", eliminarLogAccesoController);

export default router;