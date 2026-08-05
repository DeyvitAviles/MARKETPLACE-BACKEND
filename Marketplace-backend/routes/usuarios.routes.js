const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const { autenticar, autenticacionOpcional, permitirRoles } = require('../middlewares/auth');

router.post('/login', controller.login);
router.post('/registro', controller.crearUsuario);
router.post('/', controller.crearUsuario); // Compatibilidad con Flutter actual
router.get('/me', autenticar, controller.me);
router.get('/', autenticar, permitirRoles('administrador', 'superadministrador'), controller.listarUsuarios);
router.post('/admin', autenticar, permitirRoles('administrador', 'superadministrador'), controller.crearUsuarioAdmin);
router.put('/admin/:id', autenticar, permitirRoles('administrador', 'superadministrador'), controller.actualizarUsuarioAdmin);
router.delete('/admin/:id', autenticar, permitirRoles('administrador', 'superadministrador'), controller.eliminarUsuarioAdmin);
router.get('/:id/perfil', autenticacionOpcional, controller.obtenerPerfil);
router.put('/:id/perfil', autenticacionOpcional, controller.actualizarPerfil);
router.put('/:id/password', autenticacionOpcional, controller.cambiarPassword);

module.exports = router;
