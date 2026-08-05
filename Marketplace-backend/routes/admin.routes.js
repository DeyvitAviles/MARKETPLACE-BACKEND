const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const { autenticar, permitirRoles } = require('../middlewares/auth');

router.use(autenticar, permitirRoles('administrador', 'superadministrador'));
router.get('/resumen', controller.resumen);
router.get('/conversaciones', controller.listarConversaciones);
router.get('/conversaciones/:id', controller.detalleConversacion);
router.delete('/conversaciones/:id', permitirRoles('superadministrador'), controller.eliminarConversacion);

module.exports = router;
