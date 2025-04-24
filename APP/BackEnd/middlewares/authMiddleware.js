// middlewares/authMiddleware.js

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
    }

    try {
        // Aquí iría la lógica para verificar el token
        // Ejemplo: jwt.verify(token, 'tu_secreto');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export default authMiddleware;
