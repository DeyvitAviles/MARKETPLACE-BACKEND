const express = require('express');
const router = express.Router();
const controller = require('../controllers/favoritosController');
const { autenticacionOpcional } = require('../middlewares/auth');
router.post('/', autenticacionOpcional, controller.agregarFavorito);
router.get('/usuario/:usuario_id', autenticacionOpcional, controller.obtenerFavoritosUsuario);
router.get('/verificar/:usuario_id/:producto_id', autenticacionOpcional, controller.verificarFavorito);
router.delete('/:usuario_id/:producto_id', autenticacionOpcional, controller.eliminarFavorito);
module.exports = router;
