const express = require('express');

const router = express.Router();

const usuariosController =
    require('../controllers/usuarios.controller');

const verificarAdministrador =
    require('../middlewares/verificarAdministrador');


// LOGIN
router.post(
    '/login',
    usuariosController.login
);


// OBTENER PERFIL
router.get(
    '/:id/perfil',
    usuariosController.obtenerPerfil
);


// ACTUALIZAR PERFIL
router.put(
    '/:id/perfil',
    usuariosController.actualizarPerfil
);


// CAMBIAR CONTRASEÑA
router.put(
    '/:id/password',
    usuariosController.cambiarPassword
);


// LISTAR USUARIOS
router.get(
    '/',
    verificarAdministrador,
    usuariosController.listarUsuarios
);


// CREAR USUARIO
router.post(
    '/',
    verificarAdministrador,
    usuariosController.crearUsuario
);


// MUY IMPORTANTE
module.exports = router;