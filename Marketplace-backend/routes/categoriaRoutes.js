const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriaController');
const { autenticar, permitirRoles } = require('../middlewares/auth');

router.get('/', controller.obtenerCategorias);
router.post('/', autenticar, permitirRoles('administrador', 'superadministrador'), controller.crearCategoria);
router.put('/:id', autenticar, permitirRoles('administrador', 'superadministrador'), controller.actualizarCategoria);
router.delete('/:id', autenticar, permitirRoles('administrador', 'superadministrador'), controller.eliminarCategoria);
module.exports = router;
