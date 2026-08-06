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
const extensionesPermitidas = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.heic',
  '.heif',
  '.avif',
  '.bmp',
  '.tif',
  '.tiff',
]);

const upload = multer({
  storage,

  limits: {
    fileSize: 8 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const mime = (file.mimetype || '').toLowerCase();
    const extension = path
      .extname(file.originalname || '')
      .toLowerCase();

    const mimeEsImagen = mime.startsWith('image/');
    const extensionEsImagen = extensionesPermitidas.has(extension);

    if (!mimeEsImagen && !extensionEsImagen) {
      return cb(
        new Error(
          `Archivo rechazado: ${file.originalname} (${file.mimetype})`
        )
      );
    }

    return cb(null, true);
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
