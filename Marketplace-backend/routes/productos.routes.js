const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const controller = require('../controllers/productos.controller');
const { autenticar, autenticacionOpcional, permitirRoles } = require('../middlewares/auth');

const carpetaUploads = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(carpetaUploads, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, carpetaUploads),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(permitidos.includes(file.mimetype) ? null : new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'), permitidos.includes(file.mimetype));
  },
});

router.get('/', controller.listarProductos);
router.post('/', autenticacionOpcional, upload.single('imagen'), controller.crearProducto);
router.get('/usuario/:usuario_id', controller.productosPorUsuario);
router.put('/admin/:id', autenticar, permitirRoles('administrador', 'superadministrador'), upload.single('imagen'), controller.actualizarProductoAdmin);
router.delete('/admin/:id', autenticar, permitirRoles('administrador', 'superadministrador'), controller.eliminarProductoAdmin);
router.get('/:id', controller.obtenerProducto);
router.put('/:id', autenticacionOpcional, upload.single('imagen'), controller.actualizarProducto);
router.delete('/:id', autenticacionOpcional, controller.eliminarProducto);

module.exports = router;
