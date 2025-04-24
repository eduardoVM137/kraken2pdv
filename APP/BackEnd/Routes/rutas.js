 


import express from 'express';

const router = express.Router();
 const app = express();
// Añadir rutas específicas
router.get('/holax', (req, res) => {
    res.render('index', { titulo: 'Mi Tíutulo' });
});
router.get('/holaa', (req, res) => {
    res.render('aaa.ejs');
});

// Exportar el router
export default router;