-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-04-2024 a las 07:06:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pdvkraken2`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spdetalle_state_insertar` (IN `idempleado_usuario` INT, IN `idstate` INT, IN `estado` VARCHAR(100))   BEGIN
    INSERT INTO detalle_state (idempleado_usuario, idstate, fecha, estado) VALUES (idempleado_usuario, idstate, NOW(), estado);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_categoria` (IN `_idcategoria` INT, IN `_nombre` VARCHAR(100), IN `_descripcion` VARCHAR(200))   BEGIN
    UPDATE categoria SET nombre = _nombre, descripcion = _descripcion WHERE idcategoria = _idcategoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_cliente` (IN `_idcliente` INT, IN `_codigocliente` VARCHAR(50), IN `_nombre` VARCHAR(150), IN `_apellidos` VARCHAR(200), IN `_direccion` VARCHAR(150), IN `_telefono` VARCHAR(50), IN `_correo` VARCHAR(150), IN `_fecha_nacimiento` DATE, IN `_comentarios` VARCHAR(250), IN `_foto` BLOB)   BEGIN
    UPDATE cliente SET  codigo_cliente = _codigocliente, nombre = _nombre, apellidos = _apellidos, direccion = _direccion, telefono = _telefono, correo = _correo, fecha_nacimiento = _fecha_nacimiento, comentarios = _comentarios,foto=_foto WHERE idcliente = _idcliente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_componente` (IN `_idcomponente` INT, IN `_idproducto` INT, IN `_idproducto_item` INT, IN `_cantidad` DECIMAL(18,2))   BEGIN
    UPDATE componente SET idproducto = _idproducto, idproducto_item = _idproducto_item, cantidad = _cantidad WHERE idcomponente = _idcomponente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_corte_caja` (IN `_idcorte_caja` INT, IN `_idempleado_usuario` INT, IN `_fecha_hora_inicio` DATETIME, IN `_fecha_hora_fin` DATETIME, IN `_fondo_inicial` DECIMAL(18,2), IN `_total_retiros` DECIMAL(18,2), IN `_total_ventas` DECIMAL(18,2), IN `_total_entregado` DECIMAL(18,2))   BEGIN
    UPDATE corte_caja 
    SET fecha_hora_inicio = _fecha_hora_inicio, fecha_hora_fin = _fecha_hora_fin, fondo_inicial = _fondo_inicial, 
    total_retiros = _total_retiros, total_ventas = _total_ventas, total_entregado = _total_entregado
    WHERE idcorte_caja = _idcorte_caja;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_detalle_ingreso` (IN `_iddetalle_ingreso` INT, IN `_idingreso` INT, IN `_idproducto` INT, IN `_cantidad` DECIMAL(18,2), IN `_precio_costo` DECIMAL(18,2))   BEGIN
    UPDATE detalle_ingreso SET idingreso = _idingreso, idproducto = _idproducto, cantidad = _cantidad, precio_costo = _precio_costo WHERE iddetalle_ingreso = _iddetalle_ingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_detalle_venta` (IN `_iddetalle_venta` INT, IN `_idventa` INT, IN `_idempleado` INT, IN `_idproducto` INT, IN `_cantidad` DECIMAL(18,2), IN `_precio` DECIMAL(18,2), IN `_descuento` DECIMAL(18,2), IN `_subtotal` DECIMAL(18,2))   BEGIN
    UPDATE detalle_venta SET idventa = _idventa, idempleado = _idempleado, idproducto = _idproducto, cantidad = _cantidad, 
    precio = _precio, descuento = _descuento, subtotal = _subtotal WHERE iddetalle_venta = _iddetalle_venta;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_empleado` (IN `_idempleado` INT, IN `_codigo_empleado` VARCHAR(50), IN `_nombre` VARCHAR(150), IN `_apellidos` VARCHAR(200), IN `_direccion` VARCHAR(50), IN `_telefono` VARCHAR(50), IN `_correo` VARCHAR(150), IN `_fecha_nacimiento` DATE, IN `_comentarios` VARCHAR(250), IN `_foto` BLOB, IN `_idstate` INT)   BEGIN
    UPDATE empleado SET codigo_empleado = _codigo_empleado, nombre = _nombre, apellidos = apellidos, direccion = _direccion, telefono = _telefono, correo = _correo, fecha_nacimiento = fecha_nacimiento, comentarios = comentarios,foto=_foto, idstate = _idstate WHERE idempleado = _idempleado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_ingreso` (IN `_idingreso` INT, IN `_idempleado` INT, IN `_idproveedor` INT, IN `_idstate` INT, IN `_fecha` DATETIME, IN `_metodo_pago` VARCHAR(50), IN `_comprobante` VARCHAR(150), IN `_iva` DECIMAL(18,2), IN `_total` DECIMAL(18,2), IN `_pagado` VARCHAR(50))   BEGIN
    UPDATE ingreso SET idempleado = _idempleado, idproveedor = _idproveedor, idstate = _idstate, fecha = _fecha, 
    metodo_pago = _metodo_pago, comprobante = _comprobante, iva = _iva, total = _total, pagado = _pagado WHERE idingreso = _idingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_inventario` (IN `_idinventario` INT, IN `_idproducto` INT, IN `_stock_actual` DECIMAL(18,2), IN `_stock_minimo` DECIMAL(18,2))   BEGIN
    UPDATE inventario SET idproducto = _idproducto, stock_actual = _stock_actual, stock_minimo = _stock_minimo WHERE idinventario = _idinventario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_producto` (IN `_idproducto` INT, IN `_idcategoria` INT, IN `_nombre` VARCHAR(50), IN `_precio_costo` DECIMAL(18,2), IN `_precio_venta` DECIMAL(18,2), IN `_tipo` VARCHAR(50), IN `_idstate` INT, IN `_presentacion` VARCHAR(50), IN `_ubicacion` VARCHAR(50), IN `_foto` LONGBLOB, IN `_codigo_barras` VARCHAR(50), IN `_codigo_propio` VARCHAR(50))   BEGIN
    UPDATE productos SET idcategoria = _idcategoria, nombre = _nombre, precio_costo = _precio_costo, precio_venta = _precio_venta, tipo = _tipo, idstate = _idstate, presentacion = _presentacion, ubicacion = _ubicacion, foto = _foto, codigo_barras = _codigo_barras, codigo_propio = _codigo_propio WHERE idproducto = _idproducto;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_proveedor` (IN `_idproveedor` INT, IN `_codigo_proveedor` VARCHAR(100), IN `_nombre` VARCHAR(250), IN `_rfc` VARCHAR(50), IN `_direccion` VARCHAR(50), IN `_telefono` VARCHAR(20), IN `_correo` VARCHAR(150), IN `_comentarios` VARCHAR(250), IN `_foto` LONGBLOB)   BEGIN
    UPDATE proveedor SET codigo_proveedor = _codigo_proveedor, nombre = _nombre, rfc = _rfc, direccion = _direccion, telefono = _telefono, correo = _correo, comentarios = _comentarios, foto = _foto WHERE idproveedor = _idproveedor;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_retiro` (IN `_idretiro` INT, IN `_idempleado_usuario` INT, IN `_idcorte_caja` INT, IN `_fecha_hora` DATETIME, IN `_monto` DECIMAL(18,2), IN `_motivo` VARCHAR(250))   BEGIN
    UPDATE retiro 
    SET fecha_hora = _fecha_hora, monto = _monto,idcorte_caja=_idcorte_caja, motivo = _motivo 
    WHERE idretiro = _idretiro;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_sub_categoria` (IN `_idsub_categoria` INT, IN `_idcategoria` INT, IN `_nombre` VARCHAR(100), IN `_descripcion` VARCHAR(200))   BEGIN
    UPDATE sub_categoria SET idcategoria = _idcategoria, nombre =_nombre, descripcion = _descripcion WHERE idsub_categoria = _idsub_categoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_venta` (IN `_idventa` INT, IN `_idempleado_usuario` INT, IN `_idcliente` INT, IN `_idstate` INT, IN `_fecha` DATETIME, IN `_metodo_pago` VARCHAR(50), IN `_comprobante` VARCHAR(50), IN `_iva` DECIMAL(18,2), IN `_total` DECIMAL(18,2), IN `_pagado` VARCHAR(50), IN `_comentarios` VARCHAR(150))   BEGIN
    UPDATE venta SET idempleado_usuario = _idempleado_usuario, idcliente = _idcliente, idstate = _idstate, fecha = _fecha, 
    metodo_pago = _metodo_pago, comprobante = _comprobante, iva = _iva, total = _total, pagado = _pagado, comentarios = _comentarios 
    WHERE idventa = _idventa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_categoria` (IN `_idcategoria` INT)   BEGIN
    DELETE FROM categoria WHERE idcategoria = _idcategoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_cliente` (IN `_idcliente` INT)   BEGIN
    DELETE FROM cliente WHERE idcliente = _idcliente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_componente` (IN `_idcomponente` INT)   BEGIN
    DELETE FROM componente WHERE idcomponente = _idcomponente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_corte_caja` (IN `_idcorte_caja` INT)   BEGIN
    DELETE FROM corte_caja WHERE idcorte_caja = _idcorte_caja;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_detalle_ingreso` (IN `_iddetalle_ingreso` INT)   BEGIN
    DELETE FROM detalle_ingreso WHERE iddetalle_ingreso = _iddetalle_ingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_detalle_venta` (IN `_iddetalle_venta` INT)   BEGIN
    DELETE FROM detalle_venta WHERE iddetalle_venta = _iddetalle_venta;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_empleado` (IN `_idempleado` INT)   BEGIN
    DELETE FROM empleado WHERE idempleado = _idempleado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_ingreso` (IN `_idingreso` INT)   BEGIN
    DELETE FROM ingreso WHERE idingreso = _idingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_inventario` (IN `_idinventario` INT)   BEGIN
    DELETE FROM inventario WHERE idinventario = _idinventario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_producto` (IN `_idproducto` INT)   BEGIN
    DELETE FROM productos WHERE idproducto = _idproducto;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_proveedor` (IN `_idproveedor` INT)   BEGIN
    DELETE FROM proveedor WHERE idproveedor = _idproveedor;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_retiro` (IN `_idretiro` INT)   BEGIN
    DELETE FROM retiro WHERE idretiro = _idretiro;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_sub_categoria` (IN `_idsub_categoria` INT)   BEGIN
    DELETE FROM sub_categoria WHERE idsub_categoria = _idsub_categoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_venta` (IN `_idventa` INT)   BEGIN
    DELETE FROM venta WHERE idventa = _idventa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_categoria` (IN `idempleado_usuario` INT, IN `nombre` VARCHAR(100), IN `descripcion` VARCHAR(200))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO categoria (idstate, nombre, descripcion) VALUES (v_idstate, nombre, descripcion);
    CALL spdetalle_state_insertar(idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_cliente` (IN `_idempleado_usuario` INT, IN `_codigocliente` VARCHAR(50), IN `_nombre` VARCHAR(150), IN `_apellidos` VARCHAR(200), IN `_direccion` VARCHAR(150), IN `_telefono` VARCHAR(50), IN `_correo` VARCHAR(150), IN `_fecha_nacimiento` DATE, IN `_comentarios` VARCHAR(250), IN `_foto` BLOB)   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    CALL spdetalle_state_insertar(_idempleado_usuario, v_idstate, 'Activo');
    INSERT INTO cliente (idstate, codigo_cliente, nombre, apellidos, direccion, telefono, correo, fecha_nacimiento, comentarios,foto) VALUES (v_idstate, _codigocliente, _nombre, _apellidos, _direccion, _telefono, _correo, _fecha_nacimiento, _comentarios,_foto);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_componente` (IN `idproducto` INT, IN `idproducto_item` INT, IN `cantidad` DECIMAL(18,2))   BEGIN
    INSERT INTO componente (idproducto, idproducto_item, cantidad) VALUES (idproducto, idproducto_item, cantidad);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_corte_caja` (IN `_idempleado_usuario` INT, IN `_fecha_hora_inicio` DATETIME, IN `_fecha_hora_fin` DATETIME, IN `_fondo_inicial` DECIMAL(18,2), IN `_total_retiros` DECIMAL(18,2), IN `_total_ventas` DECIMAL(18,2), IN `_total_entregado` DECIMAL(18,2))   BEGIN
    INSERT INTO corte_caja (idempleado_usuario, fecha_hora_inicio, fecha_hora_fin, fondo_inicial, total_retiros, total_ventas, total_entregado) 
    VALUES (_idempleado_usuario, _fecha_hora_inicio, _fecha_hora_fin, _fondo_inicial, _total_retiros, _total_ventas, _total_entregado);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_detalle_ingreso` (IN `idingreso` INT, IN `idproducto` INT, IN `cantidad` DECIMAL, IN `precio_costo` DECIMAL(18,2))   BEGIN
    INSERT INTO detalle_ingreso (idingreso, idproducto, cantidad, precio_costo) VALUES (idingreso, idproducto, cantidad, precio_costo);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_detalle_venta` (IN `_idventa` INT, IN `_idempleado` INT, IN `_idproducto` INT, IN `_cantidad` DECIMAL(18,2), IN `_precio` DECIMAL(18,2), IN `_descuento` DECIMAL(18,2), IN `_subtotal` DECIMAL(18,2))   BEGIN
    INSERT INTO detalle_venta (idventa, idempleado, idproducto, cantidad, precio, descuento, subtotal) 
    VALUES (_idventa, _idempleado, _idproducto, _cantidad, _precio, _descuento, _subtotal);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_empleado` (IN `_idempleado_usuario` INT, IN `_codigo_empleado` VARCHAR(50), IN `_nombre` VARCHAR(150), IN `_apellidos` VARCHAR(200), IN `_direccion` VARCHAR(50), IN `_telefono` VARCHAR(50), IN `_correo` VARCHAR(150), IN `_fecha_nacimiento` DATE, IN `_comentarios` VARCHAR(250), IN `_foto` BLOB)   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO empleado (codigo_empleado, nombre, apellidos, direccion, telefono, correo, fecha_nacimiento, comentarios, foto,idstate) VALUES (_codigo_empleado, _nombre, _apellidos, _direccion, _telefono, _correo, _fecha_nacimiento, _comentarios, _foto,v_idstate);
    CALL spdetalle_state_insertar(_idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_ingreso` (IN `_idempleado_usuario` INT, IN `_idproveedor` INT, IN `_fecha` DATETIME, IN `_metodo_pago` VARCHAR(50), IN `_comprobante` VARCHAR(150), IN `_iva` DECIMAL(18,2), IN `_total` DECIMAL(18,2), IN `_pagado` VARCHAR(50))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO ingreso (idempleado, idproveedor, idstate, fecha, metodo_pago, comprobante, iva, total, pagado) 
    VALUES (_idempleado_usuario, _idproveedor, v_idstate, _fecha, _metodo_pago, _comprobante, _iva, _total, _pagado);
    CALL spdetalle_state_insertar(_idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_inventario` (IN `idproducto` INT, IN `stock_actual` DECIMAL(18,2), IN `stock_minimo` DECIMAL(18,2))   BEGIN
    INSERT INTO inventario (idproducto, stock_actual, stock_minimo) VALUES (idproducto, stock_actual, stock_minimo);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_producto` (IN `idempleado_usuario` INT, IN `idcategoria` INT, IN `nombre` VARCHAR(50), IN `precio_costo` DECIMAL(18,2), IN `precio_venta` DECIMAL(18,2), IN `tipo` VARCHAR(50), IN `presentacion` VARCHAR(50), IN `ubicacion` VARCHAR(50), IN `foto` LONGBLOB, IN `codigo_barras` VARCHAR(50), IN `codigo_propio` VARCHAR(50))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO productos (idcategoria, nombre, precio_costo, precio_venta, tipo, presentacion, ubicacion, foto, codigo_barras, codigo_propio, idstate) VALUES (idcategoria, nombre, precio_costo, precio_venta, tipo, presentacion, ubicacion, foto, codigo_barras, codigo_propio, v_idstate);
    CALL spdetalle_state_insertar(idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_proveedor` (IN `codigo_proveedor` VARCHAR(100), IN `nombre` VARCHAR(250), IN `rfc` VARCHAR(50), IN `direccion` VARCHAR(50), IN `telefono` VARCHAR(20), IN `correo` VARCHAR(150), IN `comentarios` VARCHAR(250), IN `foto` LONGBLOB)   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO proveedor (idstate, codigo_proveedor, nombre, rfc, direccion, telefono, correo, comentarios, foto) VALUES (v_idstate, codigo_proveedor, nombre, rfc, direccion, telefono, correo, comentarios, foto);
    CALL spdetalle_state_insertar(0, v_idstate, 'Activo'); -- Asumiendo '0' como valor de 'idempleado_usuario' provisional
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_retiro` (IN `_idempleado_usuario` INT, IN `_idcorte_caja` INT, IN `_fecha_hora` DATETIME, IN `_monto` DECIMAL(18,2), IN `_motivo` VARCHAR(250))   BEGIN
    INSERT INTO retiro (idempleado_usuario, idcorte_caja, fecha_hora, monto, motivo) 
    VALUES (_idempleado_usuario, _idcorte_caja, _fecha_hora, _monto, _motivo);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_sub_categoria` (IN `_idempleado_usuario` INT, IN `_idcategoria` INT, IN `_nombre` VARCHAR(100), IN `_descripcion` VARCHAR(200))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO sub_categoria (idcategoria, nombre, descripcion) VALUES (_idcategoria, _nombre, _descripcion);
    CALL spdetalle_state_insertar(_idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_venta` (IN `_idempleado_usuario` INT, IN `_idcliente` INT, IN `_fecha` DATETIME, IN `_metodo_pago` VARCHAR(50), IN `_comprobante` VARCHAR(50), IN `_iva` DECIMAL(18,2), IN `_total` DECIMAL(18,2), IN `_pagado` VARCHAR(50), IN `_comentarios` VARCHAR(150))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO venta (idempleado_usuario, idcliente, idstate, fecha, metodo_pago, comprobante, iva, total, pagado,comentarios) 
    VALUES (_idempleado_usuario, _idcliente, v_idstate, _fecha, _metodo_pago, _comprobante, _iva, _total, _pagado,_comentarios);
    CALL spdetalle_state_insertar(_idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_categoria` ()   BEGIN
    SELECT * FROM categoria ORDER BY idcategoria DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_cliente` ()   BEGIN
    SELECT * FROM cliente ORDER BY idcliente DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_componente` ()   BEGIN
    SELECT * FROM componente ORDER BY idcomponente DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_corte_caja` ()   BEGIN
    SELECT * FROM corte_caja ORDER BY idcorte_caja DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_detalle_ingreso` ()   BEGIN
    SELECT * FROM detalle_ingreso ORDER BY iddetalle_ingreso DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_detalle_venta` ()   BEGIN
    SELECT * FROM detalle_venta ORDER BY iddetalle_venta DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_empleado` ()   BEGIN
    SELECT * FROM empleado ORDER BY idempleado DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_ingreso` ()   BEGIN
    SELECT * FROM ingreso ORDER BY idingreso DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_inventario` ()   BEGIN
    SELECT * FROM inventario ORDER BY idinventario DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_producto` ()   BEGIN
    SELECT * FROM productos ORDER BY idproducto DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_proveedor` ()   BEGIN
    SELECT * FROM proveedor ORDER BY idproveedor DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_retiro` ()   BEGIN
    SELECT * FROM retiro ORDER BY idretiro DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_state` ()   BEGIN
    SELECT * FROM state ORDER BY idstate DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_sub_categoria` ()   BEGIN
    SELECT * FROM sub_categoria ORDER BY idsub_categoria DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spmostrar_venta` ()   BEGIN
    SELECT * FROM venta ORDER BY idventa DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spstate_insertar_nuevo` (OUT `idstate` INT)   BEGIN
    INSERT INTO state (idstate) VALUES (idstate);
    SET idstate = LAST_INSERT_ID();
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `idcategoria` int(11) NOT NULL,
  `idstate` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`idcategoria`, `idstate`, `nombre`, `descripcion`) VALUES
(1, 0, 'pri categoria editados', 'primer descripcions'),
(2, 0, 'seg categoria editadoss6s', 'seg descripcions');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL,
  `idstate` int(11) DEFAULT NULL,
  `codigo_cliente` varchar(50) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `apellidos` varchar(200) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `comentarios` varchar(250) DEFAULT NULL,
  `foto` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`idcliente`, `idstate`, `codigo_cliente`, `nombre`, `apellidos`, `direccion`, `telefono`, `correo`, `fecha_nacimiento`, `comentarios`, `foto`) VALUES
(2, 2, NULL, '1', 'seg  editado', 'seg  apellidos', 'seg  ', '66666666 ', '0000-00-00', 'd', 0x7365672020),
(3, 3, '1', 'seg  nombre', 'seg  apellidos', 'seg  ', 'seg  ', 'seeeg@gmail.com', NULL, 'seg  ', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `componente`
--

CREATE TABLE `componente` (
  `idcomponente` int(11) NOT NULL,
  `idproducto` int(11) NOT NULL,
  `idproducto_item` int(11) NOT NULL,
  `cantidad` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `componente`
--

INSERT INTO `componente` (`idcomponente`, `idproducto`, `idproducto_item`, `cantidad`) VALUES
(2, 1, 1, 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `corte_caja`
--

CREATE TABLE `corte_caja` (
  `idcorte_caja` int(11) NOT NULL,
  `idempleado_usuario` int(11) NOT NULL,
  `fecha_hora_inicio` datetime NOT NULL,
  `fecha_hora_fin` datetime NOT NULL,
  `fondo_inicial` decimal(18,2) NOT NULL,
  `total_retiros` decimal(18,2) NOT NULL,
  `total_ventas` decimal(18,2) NOT NULL,
  `total_entregado` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `corte_caja`
--

INSERT INTO `corte_caja` (`idcorte_caja`, `idempleado_usuario`, `fecha_hora_inicio`, `fecha_hora_fin`, `fondo_inicial`, `total_retiros`, `total_ventas`, `total_entregado`) VALUES
(2, 1, '0000-00-00 00:00:00', '1969-12-31 18:00:00', 1.00, 1.00, 6.66, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ingreso`
--

CREATE TABLE `detalle_ingreso` (
  `iddetalle_ingreso` int(11) NOT NULL,
  `idingreso` int(11) NOT NULL,
  `idproducto` int(11) NOT NULL,
  `idstate` int(11) DEFAULT NULL,
  `cantidad` decimal(18,2) NOT NULL,
  `precio_costo` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ingreso`
--

INSERT INTO `detalle_ingreso` (`iddetalle_ingreso`, `idingreso`, `idproducto`, `idstate`, `cantidad`, `precio_costo`) VALUES
(2, 1, 1, NULL, 6.66, 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_state`
--

CREATE TABLE `detalle_state` (
  `iddetalle_state` int(11) NOT NULL,
  `idstate` int(11) NOT NULL,
  `idempleado_usuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_state`
--

INSERT INTO `detalle_state` (`iddetalle_state`, `idstate`, `idempleado_usuario`, `fecha`, `estado`) VALUES
(3, 1, 2, '2024-04-10 15:32:04', 'Activo'),
(4, 2, 1, '2024-04-10 16:14:38', 'Activo'),
(5, 3, 1, '2024-04-11 19:07:45', 'Activo'),
(6, 4, 1, '2024-04-12 15:50:41', 'Activo'),
(7, 5, 1, '2024-04-12 16:06:06', 'Activo'),
(8, 6, 1, '2024-04-12 16:06:33', 'Activo'),
(9, 9, 1, '2024-04-14 01:24:22', 'Activo'),
(10, 10, 0, '2024-04-14 02:02:29', 'Activo'),
(11, 11, 0, '2024-04-14 02:05:35', 'Activo'),
(12, 12, 0, '2024-04-14 02:05:38', 'Activo'),
(13, 13, 0, '2024-04-14 02:05:38', 'Activo'),
(14, 14, 0, '2024-04-14 02:05:38', 'Activo'),
(15, 17, 1, '2024-04-14 02:34:40', 'Activo'),
(16, 18, 1, '2024-04-14 02:35:00', 'Activo'),
(17, 19, 1, '2024-04-14 02:35:00', 'Activo'),
(18, 20, 1, '2024-04-14 02:35:00', 'Activo'),
(19, 22, 1, '2024-04-14 13:14:16', 'Activo'),
(20, 23, 1, '2024-04-14 13:14:20', 'Activo'),
(21, 24, 1, '2024-04-14 13:14:20', 'Activo'),
(22, 25, 1, '2024-04-14 13:18:25', 'Activo'),
(23, 26, 1, '2024-04-14 13:18:57', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `iddetalle_venta` int(11) NOT NULL,
  `idventa` int(11) DEFAULT NULL,
  `idempleado` int(11) DEFAULT NULL,
  `idproducto` int(11) DEFAULT NULL,
  `cantidad` decimal(18,2) DEFAULT NULL,
  `precio` decimal(18,2) DEFAULT NULL,
  `descuento` decimal(18,2) DEFAULT NULL,
  `subtotal` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`iddetalle_venta`, `idventa`, `idempleado`, `idproducto`, `cantidad`, `precio`, `descuento`, `subtotal`) VALUES
(4, 2, 1, 1, 1.00, 6.66, 1.00, 1.00),
(6, 3, 1, 1, 1.00, 1.00, 1.00, 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `idempleado` int(11) NOT NULL,
  `codigo_empleado` varchar(50) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `apellidos` varchar(200) DEFAULT NULL,
  `foto` blob DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `comentarios` varchar(250) DEFAULT NULL,
  `idstate` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`idempleado`, `codigo_empleado`, `nombre`, `apellidos`, `foto`, `direccion`, `telefono`, `correo`, `fecha_nacimiento`, `comentarios`, `idstate`) VALUES
(1, '666', 'seg  nombre', 'seg  apellidos', NULL, 'seg  ', 'seg  ', 'seeeg@gmail.com', '1899-11-30', 'seg  ', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingreso`
--

CREATE TABLE `ingreso` (
  `idingreso` int(11) NOT NULL,
  `idempleado` int(11) NOT NULL,
  `idproveedor` int(11) NOT NULL,
  `idstate` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `comprobante` varchar(150) DEFAULT NULL,
  `iva` decimal(18,2) DEFAULT NULL,
  `total` decimal(18,2) NOT NULL,
  `pagado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `idinventario` int(11) NOT NULL,
  `idproducto` int(11) NOT NULL,
  `stock_actual` decimal(18,2) DEFAULT NULL,
  `stock_minimo` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`idinventario`, `idproducto`, `stock_actual`, `stock_minimo`) VALUES
(4, 1, 1.00, 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `idproducto` int(11) NOT NULL,
  `idcategoria` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio_costo` decimal(18,2) DEFAULT NULL,
  `precio_venta` decimal(18,2) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `idstate` int(11) DEFAULT NULL,
  `presentacion` varchar(50) DEFAULT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `foto` varchar(50) DEFAULT NULL,
  `codigo_barras` varchar(50) DEFAULT NULL,
  `codigo_propio` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idproducto`, `idcategoria`, `nombre`, `precio_costo`, `precio_venta`, `tipo`, `idstate`, `presentacion`, `ubicacion`, `foto`, `codigo_barras`, `codigo_propio`) VALUES
(1, 1, '1', 1.00, 1.00, '1', 7, '1', '1.00', '1.00', '1.00', '1.00'),
(3, 1, '1', 1.00, 1.00, '1', 9, '1', '1.00', '1.00', '1.00', '1.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `idproveedor` int(11) NOT NULL,
  `idstate` int(11) DEFAULT NULL,
  `codigo_proveedor` varchar(100) DEFAULT NULL,
  `nombre` varchar(250) NOT NULL,
  `rfc` varchar(50) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `comentarios` varchar(250) DEFAULT NULL,
  `foto` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`idproveedor`, `idstate`, `codigo_proveedor`, `nombre`, `rfc`, `direccion`, `telefono`, `correo`, `comentarios`, `foto`) VALUES
(2, 11, '1.00', '1.00', '1.00', '1.66', '1.00', 'laolfo@gmail.com', '1.00', NULL),
(3, 12, '1.00', '1.00', '1.00', '1.66', '1.00', 'laolfo@gmail.com', '1.00', NULL),
(5, 14, '1.00', '1.00', '1.00', '1.66', '1.00', 'laolfo@gmail.com', '1.00', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retiro`
--

CREATE TABLE `retiro` (
  `idretiro` int(11) NOT NULL,
  `idempleado_usuario` int(11) NOT NULL,
  `idcorte_caja` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `monto` decimal(18,2) NOT NULL,
  `motivo` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `retiro`
--

INSERT INTO `retiro` (`idretiro`, `idempleado_usuario`, `idcorte_caja`, `fecha_hora`, `monto`, `motivo`) VALUES
(1, 1, 1, '0000-00-00 00:00:00', 1.23, '28/12/2012'),
(3, 1, 1, '2021-12-12 00:00:00', 1.66, '1.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `state`
--

CREATE TABLE `state` (
  `idstate` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `state`
--

INSERT INTO `state` (`idstate`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sub_categoria`
--

CREATE TABLE `sub_categoria` (
  `idsub_categoria` int(11) NOT NULL,
  `idcategoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sub_categoria`
--

INSERT INTO `sub_categoria` (`idsub_categoria`, `idcategoria`, `nombre`, `descripcion`) VALUES
(1, 1, '1.00', '1.00'),
(2, 1, '1.00', '1.00'),
(4, 1, '1.00', '1.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `idventa` int(11) NOT NULL,
  `idempleado_usuario` int(11) DEFAULT NULL,
  `idcliente` int(11) DEFAULT NULL,
  `idstate` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `comprobante` varchar(50) DEFAULT NULL,
  `iva` decimal(18,2) DEFAULT NULL,
  `total` decimal(18,2) DEFAULT NULL,
  `pagado` varchar(50) DEFAULT NULL,
  `comentarios` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`idventa`, `idempleado_usuario`, `idcliente`, `idstate`, `fecha`, `metodo_pago`, `comprobante`, `iva`, `total`, `pagado`, `comentarios`) VALUES
(1, 1, 1, 22, '1969-12-31 18:00:00', '1.00', '1.00', 1.00, 1.00, '1.00', NULL),
(3, 1, 1, 24, '1969-12-31 18:00:00', '1.00', '1.00', 1.00, 1.00, '1.00', NULL),
(4, 1, 1, 25, '1969-12-31 18:00:00', '1.00', '1.00', 1.00, 1.00, '1.00', NULL),
(5, 1, 1, 26, '1969-12-31 18:00:00', '1.00', '1.00', 1.00, 1.00, '1.00', '1.00sss');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`idcategoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idcliente`);

--
-- Indices de la tabla `componente`
--
ALTER TABLE `componente`
  ADD PRIMARY KEY (`idcomponente`);

--
-- Indices de la tabla `corte_caja`
--
ALTER TABLE `corte_caja`
  ADD PRIMARY KEY (`idcorte_caja`);

--
-- Indices de la tabla `detalle_ingreso`
--
ALTER TABLE `detalle_ingreso`
  ADD PRIMARY KEY (`iddetalle_ingreso`);

--
-- Indices de la tabla `detalle_state`
--
ALTER TABLE `detalle_state`
  ADD PRIMARY KEY (`iddetalle_state`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`iddetalle_venta`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`idempleado`);

--
-- Indices de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD PRIMARY KEY (`idingreso`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`idinventario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`idproducto`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`idproveedor`);

--
-- Indices de la tabla `retiro`
--
ALTER TABLE `retiro`
  ADD PRIMARY KEY (`idretiro`);

--
-- Indices de la tabla `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`idstate`);

--
-- Indices de la tabla `sub_categoria`
--
ALTER TABLE `sub_categoria`
  ADD PRIMARY KEY (`idsub_categoria`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`idventa`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `idcategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `componente`
--
ALTER TABLE `componente`
  MODIFY `idcomponente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `corte_caja`
--
ALTER TABLE `corte_caja`
  MODIFY `idcorte_caja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_ingreso`
--
ALTER TABLE `detalle_ingreso`
  MODIFY `iddetalle_ingreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_state`
--
ALTER TABLE `detalle_state`
  MODIFY `iddetalle_state` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `iddetalle_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `idempleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  MODIFY `idingreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `idinventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idproducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `idproveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `retiro`
--
ALTER TABLE `retiro`
  MODIFY `idretiro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `state`
--
ALTER TABLE `state`
  MODIFY `idstate` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `sub_categoria`
--
ALTER TABLE `sub_categoria`
  MODIFY `idsub_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `idventa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
