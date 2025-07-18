-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-04-2024 a las 06:35:53
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pdvkraken_2`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spdetalle_state_insertar` (IN `idempleado_usuario` INT, IN `idstate` INT, IN `estado` VARCHAR(100))   BEGIN
    INSERT INTO detalle_state (idempleado_usuario, idstate, fecha, estado) VALUES (idempleado_usuario, idstate, NOW(), estado);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_categoria` (IN `idcategoria` INT, IN `nombre` VARCHAR(100), IN `descripcion` VARCHAR(200))   BEGIN
    UPDATE categoria SET nombre = nombre, descripcion = descripcion WHERE idcategoria = idcategoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_cliente` (IN `idcliente` INT, IN `idstate` INT, IN `codigocliente` VARCHAR(50), IN `nombre` VARCHAR(150), IN `apellidos` VARCHAR(200), IN `direccion` VARCHAR(150), IN `telefono` VARCHAR(50), IN `correo` VARCHAR(150), IN `fecha_nacimiento` DATE, IN `comentarios` VARCHAR(250))   BEGIN
    UPDATE cliente SET idstate = idstate, codigo_cliente = codigocliente, nombre = nombre, apellidos = apellidos, direccion = direccion, telefono = telefono, correo = correo, fecha_nacimiento = fecha_nacimiento, comentarios = comentarios WHERE idcliente = idcliente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_componente` (IN `idcomponente` INT, IN `idproducto` INT, IN `idproducto_item` INT, IN `cantidad` DECIMAL(18,2))   BEGIN
    UPDATE componente SET idproducto = idproducto, idproducto_item = idproducto_item, cantidad = cantidad WHERE idcomponente = idcomponente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_corte_caja` (IN `idcorte_caja` INT, IN `idempleado_usuario` INT, IN `fecha_hora_inicio` DATETIME, IN `fecha_hora_fin` DATETIME, IN `fondo_inicial` DECIMAL(18,2), IN `total_retiros` DECIMAL(18,2), IN `total_ventas` DECIMAL(18,2), IN `total_entregado` DECIMAL(18,2))   BEGIN
    UPDATE corte_caja 
    SET fecha_hora_inicio = fecha_hora_inicio, fecha_hora_fin = fecha_hora_fin, fondo_inicial = fondo_inicial, 
    total_retiros = total_retiros, total_ventas = total_ventas, total_entregado = total_entregado
    WHERE idcorte_caja = idcorte_caja;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_detalle_ingreso` (IN `iddetalle_ingreso` INT, IN `idingreso` INT, IN `idproducto` INT, IN `cantidad` INT, IN `precio_costo` DECIMAL(18,2))   BEGIN
    UPDATE detalle_ingreso SET idingreso = idingreso, idproducto = idproducto, cantidad = cantidad, precio_costo = precio_costo WHERE iddetalle_ingreso = iddetalle_ingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_detalle_venta` (IN `iddetalle_venta` INT, IN `idventa` INT, IN `idempleado` INT, IN `idproducto` INT, IN `cantidad` DECIMAL(18,2), IN `precio` DECIMAL(18,2), IN `descuento` DECIMAL(18,2), IN `subtotal` DECIMAL(18,2))   BEGIN
    UPDATE detalle_venta SET idventa = idventa, idempleado = idempleado, idproducto = idproducto, cantidad = cantidad, 
    precio = precio, descuento = descuento, subtotal = subtotal WHERE iddetalle_venta = iddetalle_venta;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_empleado` (IN `idempleado` INT, IN `codigo_empleado` VARCHAR(50), IN `nombre` VARCHAR(150), IN `apellidos` VARCHAR(200), IN `direccion` VARCHAR(50), IN `telefono` VARCHAR(50), IN `correo` VARCHAR(150), IN `fecha_nacimiento` DATE, IN `comentarios` VARCHAR(250), IN `idstate` INT)   BEGIN
    UPDATE empleado SET codigo_empleado = codigo_empleado, nombre = nombre, apellidos = apellidos, direccion = direccion, telefono = telefono, correo = correo, fecha_nacimiento = fecha_nacimiento, comentarios = comentarios, idstate = idstate WHERE idempleado = idempleado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_ingreso` (IN `idingreso` INT, IN `idempleado` INT, IN `idproveedor` INT, IN `idstate` INT, IN `fecha` DATETIME, IN `metodo_pago` VARCHAR(50), IN `comprobante` VARCHAR(150), IN `iva` DECIMAL(18,2), IN `total` DECIMAL(18,2), IN `pagado` VARCHAR(50))   BEGIN
    UPDATE ingreso SET idempleado = idempleado, idproveedor = idproveedor, idstate = idstate, fecha = fecha, 
    metodo_pago = metodo_pago, comprobante = comprobante, iva = iva, total = total, pagado = pagado WHERE idingreso = idingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_inventario` (IN `idinventario` INT, IN `idproducto` INT, IN `stock_actual` DECIMAL(18,2), IN `stock_minimo` DECIMAL(18,2))   BEGIN
    UPDATE inventario SET idproducto = idproducto, stock_actual = stock_actual, stock_minimo = stock_minimo WHERE idinventario = idinventario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_producto` (IN `idproducto` INT, IN `idcategoria` INT, IN `nombre` VARCHAR(50), IN `precio_costo` DECIMAL(18,2), IN `precio_venta` DECIMAL(18,2), IN `tipo` VARCHAR(50), IN `idstate` INT, IN `presentacion` VARCHAR(50), IN `ubicacion` VARCHAR(50), IN `foto` LONGBLOB, IN `codigo_barras` VARCHAR(50), IN `codigo_propio` VARCHAR(50))   BEGIN
    UPDATE productos SET idcategoria = idcategoria, nombre = nombre, precio_costo = precio_costo, precio_venta = precio_venta, tipo = tipo, idstate = idstate, presentacion = presentacion, ubicacion = ubicacion, foto = foto, codigo_barras = codigo_barras, codigo_propio = codigo_propio WHERE idproducto = idproducto;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_proveedor` (IN `idproveedor` INT, IN `codigo_proveedor` VARCHAR(100), IN `nombre` VARCHAR(250), IN `rfc` VARCHAR(50), IN `direccion` VARCHAR(50), IN `telefono` VARCHAR(20), IN `correo` VARCHAR(150), IN `comentarios` VARCHAR(250), IN `foto` LONGBLOB)   BEGIN
    UPDATE proveedor SET codigo_proveedor = codigo_proveedor, nombre = nombre, rfc = rfc, direccion = direccion, telefono = telefono, correo = correo, comentarios = comentarios, foto = foto WHERE idproveedor = idproveedor;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_retiro` (IN `idretiro` INT, IN `idempleado_usuario` INT, IN `fecha_hora` DATETIME, IN `monto` DECIMAL(18,2), IN `motivo` VARCHAR(250))   BEGIN
    UPDATE retiro 
    SET fecha_hora = fecha_hora, monto = monto, motivo = motivo 
    WHERE idretiro = idretiro;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_sub_categoria` (IN `idsub_categoria` INT, IN `idcategoria` INT, IN `nombre` VARCHAR(100), IN `descripcion` VARCHAR(200))   BEGIN
    UPDATE sub_categoria SET idcategoria = idcategoria, nombre = nombre, descripcion = descripcion WHERE idsub_categoria = idsub_categoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speditar_venta` (IN `idventa` INT, IN `idempleado_usuario` INT, IN `idcliente` INT, IN `idstate` INT, IN `fecha` DATETIME, IN `metodo_pago` VARCHAR(50), IN `comprobante` VARCHAR(50), IN `iva` DECIMAL(18,2), IN `total` DECIMAL(18,2), IN `pagado` VARCHAR(50), IN `comentarios` VARCHAR(150))   BEGIN
    UPDATE venta SET idempleado_usuario = idempleado_usuario, idcliente = idcliente, idstate = idstate, fecha = fecha, 
    metodo_pago = metodo_pago, comprobante = comprobante, iva = iva, total = total, pagado = pagado, comentarios = comentarios 
    WHERE idventa = idventa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_categoria` (IN `idcategoria` INT)   BEGIN
    DELETE FROM categoria WHERE idcategoria = idcategoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_cliente` (IN `idcliente` INT)   BEGIN
    DELETE FROM cliente WHERE idcliente = idcliente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_componente` (IN `idcomponente` INT)   BEGIN
    DELETE FROM componente WHERE idcomponente = idcomponente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_corte_caja` (IN `idcorte_caja` INT)   BEGIN
    DELETE FROM corte_caja WHERE idcorte_caja = idcorte_caja;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_detalle_ingreso` (IN `iddetalle_ingreso` INT)   BEGIN
    DELETE FROM detalle_ingreso WHERE iddetalle_ingreso = iddetalle_ingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_detalle_venta` (IN `iddetalle_venta` INT)   BEGIN
    DELETE FROM detalle_venta WHERE iddetalle_venta = iddetalle_venta;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_empleado` (IN `idempleado` INT)   BEGIN
    DELETE FROM empleado WHERE idempleado = idempleado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_ingreso` (IN `idingreso` INT)   BEGIN
    DELETE FROM ingreso WHERE idingreso = idingreso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_inventario` (IN `idinventario` INT)   BEGIN
    DELETE FROM inventario WHERE idinventario = idinventario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_producto` (IN `idproducto` INT)   BEGIN
    DELETE FROM productos WHERE idproducto = idproducto;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_proveedor` (IN `idproveedor` INT)   BEGIN
    DELETE FROM proveedor WHERE idproveedor = idproveedor;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_retiro` (IN `idretiro` INT)   BEGIN
    DELETE FROM retiro WHERE idretiro = idretiro;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_sub_categoria` (IN `idsub_categoria` INT)   BEGIN
    DELETE FROM sub_categoria WHERE idsub_categoria = idsub_categoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `speliminar_venta` (IN `idventa` INT)   BEGIN
    DELETE FROM venta WHERE idventa = idventa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_categoria` (IN `idempleado_usuario` INT, IN `nombre` VARCHAR(100), IN `descripcion` VARCHAR(200))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO categoria (idstate, nombre, descripcion) VALUES (v_idstate, nombre, descripcion);
    CALL spdetalle_state_insertar(idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_cliente` (IN `idempleado_usuario` INT, IN `codigocliente` VARCHAR(50), IN `nombre` VARCHAR(150), IN `apellidos` VARCHAR(200), IN `direccion` VARCHAR(150), IN `telefono` VARCHAR(50), IN `correo` VARCHAR(150), IN `fecha_nacimiento` DATE, IN `comentarios` VARCHAR(250))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    CALL spdetalle_state_insertar(idempleado_usuario, v_idstate, 'Activo');
    INSERT INTO cliente (idstate, codigo_cliente, nombre, apellidos, direccion, telefono, correo, fecha_nacimiento, comentarios) VALUES (v_idstate, codigocliente, nombre, apellidos, direccion, telefono, correo, fecha_nacimiento, comentarios);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_componente` (IN `idproducto` INT, IN `idproducto_item` INT, IN `cantidad` DECIMAL(18,2))   BEGIN
    INSERT INTO componente (idproducto, idproducto_item, cantidad) VALUES (idproducto, idproducto_item, cantidad);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_corte_caja` (IN `idempleado_usuario` INT, IN `fecha_hora_inicio` DATETIME, IN `fecha_hora_fin` DATETIME, IN `fondo_inicial` DECIMAL(18,2), IN `total_retiros` DECIMAL(18,2), IN `total_ventas` DECIMAL(18,2), IN `total_entregado` DECIMAL(18,2))   BEGIN
    INSERT INTO corte_caja (idempleado_usuario, fecha_hora_inicio, fecha_hora_fin, fondo_inicial, total_retiros, total_ventas, total_entregado) 
    VALUES (idempleado_usuario, fecha_hora_inicio, fecha_hora_fin, fondo_inicial, total_retiros, total_ventas, total_entregado);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_detalle_ingreso` (IN `idingreso` INT, IN `idproducto` INT, IN `cantidad` INT, IN `precio_costo` DECIMAL(18,2))   BEGIN
    INSERT INTO detalle_ingreso (idingreso, idproducto, cantidad, precio_costo) VALUES (idingreso, idproducto, cantidad, precio_costo);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_detalle_venta` (IN `idventa` INT, IN `idempleado` INT, IN `idproducto` INT, IN `cantidad` DECIMAL(18,2), IN `precio` DECIMAL(18,2), IN `descuento` DECIMAL(18,2), IN `subtotal` DECIMAL(18,2))   BEGIN
    INSERT INTO detalle_venta (idventa, idempleado, idproducto, cantidad, precio, descuento, subtotal) 
    VALUES (idventa, idempleado, idproducto, cantidad, precio, descuento, subtotal);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_empleado` (IN `idempleado_usuario` INT, IN `codigo_empleado` VARCHAR(50), IN `nombre` VARCHAR(150), IN `apellidos` VARCHAR(200), IN `direccion` VARCHAR(50), IN `telefono` VARCHAR(50), IN `correo` VARCHAR(150), IN `fecha_nacimiento` DATE, IN `comentarios` VARCHAR(250))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO empleado (codigo_empleado, nombre, apellidos, direccion, telefono, correo, fecha_nacimiento, comentarios, idstate) VALUES (codigo_empleado, nombre, apellidos, direccion, telefono, correo, fecha_nacimiento, comentarios, v_idstate);
    CALL spdetalle_state_insertar(idempleado_usuario, v_idstate, 'Activo');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_ingreso` (IN `idempleado_usuario` INT, IN `idproveedor` INT, IN `fecha` DATETIME, IN `metodo_pago` VARCHAR(50), IN `comprobante` VARCHAR(150), IN `iva` DECIMAL(18,2), IN `total` DECIMAL(18,2), IN `pagado` VARCHAR(50))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO ingreso (idempleado, idproveedor, idstate, fecha, metodo_pago, comprobante, iva, total, pagado) 
    VALUES (idempleado_usuario, idproveedor, v_idstate, fecha, metodo_pago, comprobante, iva, total, pagado);
    CALL spdetalle_state_insertar(idempleado_usuario, v_idstate, 'Activo');
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_retiro` (IN `idempleado_usuario` INT, IN `idcorte_caja` INT, IN `fecha_hora` DATETIME, IN `monto` DECIMAL(18,2), IN `motivo` VARCHAR(250))   BEGIN
    INSERT INTO retiro (idempleado_usuario, idcorte_caja, fecha_hora, monto, motivo) 
    VALUES (idempleado_usuario, idcorte_caja, fecha_hora, monto, motivo);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spinsertar_sub_categoria` (IN `idempleado_usuario` INT, IN `idcategoria` INT, IN `nombre` VARCHAR(100), IN `descripcion` VARCHAR(200))   BEGIN
    DECLARE v_idstate INT;
    CALL spstate_insertar_nuevo(v_idstate);
    INSERT INTO sub_categoria (idcategoria, nombre, descripcion, idstate) VALUES (idcategoria, nombre, descripcion, v_idstate);
    CALL spdetalle_state_insertar(idempleado_usuario, v_idstate, 'Activo');
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
(1, 0, 'seg categoria editado', 'primer descripcion'),
(2, 0, 'seg categoria editado', 'primer descripcion');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ingreso`
--

CREATE TABLE `detalle_ingreso` (
  `iddetalle_ingreso` int(11) NOT NULL,
  `idingreso` int(11) NOT NULL,
  `idproducto` int(11) NOT NULL,
  `idstate` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_costo` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_state`
--

CREATE TABLE `detalle_state` (
  `idetalle_state` int(11) NOT NULL,
  `idstate` int(11) NOT NULL,
  `idempleado_usuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_state`
--

INSERT INTO `detalle_state` (`idetalle_state`, `idstate`, `idempleado_usuario`, `fecha`, `estado`) VALUES
(1, 0, 1, '2024-03-27 22:12:11', 'Activo'),
(2, 0, 1, '2024-03-27 22:13:38', 'Activo');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `state`
--

CREATE TABLE `state` (
  `idstate` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `state`
--

INSERT INTO `state` (`idstate`) VALUES
(NULL),
(NULL);

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
  ADD PRIMARY KEY (`idetalle_state`);

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
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `componente`
--
ALTER TABLE `componente`
  MODIFY `idcomponente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `corte_caja`
--
ALTER TABLE `corte_caja`
  MODIFY `idcorte_caja` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_ingreso`
--
ALTER TABLE `detalle_ingreso`
  MODIFY `iddetalle_ingreso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_state`
--
ALTER TABLE `detalle_state`
  MODIFY `idetalle_state` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `iddetalle_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `idempleado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  MODIFY `idingreso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `idinventario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idproducto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `idproveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `retiro`
--
ALTER TABLE `retiro`
  MODIFY `idretiro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sub_categoria`
--
ALTER TABLE `sub_categoria`
  MODIFY `idsub_categoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `idventa` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
