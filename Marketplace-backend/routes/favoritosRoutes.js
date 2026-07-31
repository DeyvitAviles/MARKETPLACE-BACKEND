const express = require('express');

const router = express.Router();

const favoritosController =
    require('../controllers/favoritosController');


// =====================================================
// AGREGAR FAVORITO
// =====================================================

router.post(
    '/',
    favoritosController.agregarFavorito
);


// =====================================================
// FAVORITOS DEL USUARIO
// =====================================================

router.get(
    '/usuario/:usuario_id',
    favoritosController.obtenerFavoritosUsuario
);


// =====================================================
// VERIFICAR FAVORITO
// =====================================================

router.get(
    '/verificar/:usuario_id/:producto_id',
    favoritosController.verificarFavorito
);


// =====================================================
// ELIMINAR FAVORITO
// =====================================================

router.delete(
    '/:usuario_id/:producto_id',
    favoritosController.eliminarFavorito
);


module.exports = router;