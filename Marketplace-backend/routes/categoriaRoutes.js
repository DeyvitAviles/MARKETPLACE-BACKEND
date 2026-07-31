const express = require('express');

const router = express.Router();

const categoriaController =
    require('../controllers/categoriaController');


// ==========================================
// OBTENER CATEGORÍAS
// GET /categorias
// ==========================================

router.get(
    '/',
    categoriaController.obtenerCategorias
);


// ==========================================
// CREAR CATEGORÍA
// POST /categorias
// ==========================================

router.post(
    '/',
    categoriaController.crearCategoria
);


// ==========================================
// ACTUALIZAR CATEGORÍA
// PUT /categorias/:id
// ==========================================

router.put(
    '/:id',
    categoriaController.actualizarCategoria
);


// ==========================================
// ELIMINAR CATEGORÍA
// DELETE /categorias/:id
// ==========================================

router.delete(
    '/:id',
    categoriaController.eliminarCategoria
);


module.exports = router;