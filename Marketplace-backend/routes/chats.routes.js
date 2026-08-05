const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const controller = require('../controllers/chats.controller');
const { autenticacionOpcional } = require('../middlewares/auth');

const carpeta = path.join(__dirname, '..', 'uploads', 'chats');
fs.mkdirSync(carpeta, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, carpeta),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Solo se permiten imágenes JPG, PNG o WEBP'), ok);
  },
});

router.post('/conversacion', autenticacionOpcional, controller.crearConversacion);
router.get('/usuario/:usuario_id', autenticacionOpcional, controller.obtenerConversaciones);
router.get('/conversacion/:id', autenticacionOpcional, controller.obtenerConversacion);
router.post('/mensaje', autenticacionOpcional, controller.enviarMensaje);
router.post('/imagen', autenticacionOpcional, upload.single('imagen'), controller.enviarImagen);
router.get('/mensajes/:conversacion_id', autenticacionOpcional, controller.obtenerMensajes);
router.put('/mensajes/:conversacion_id/leidos', autenticacionOpcional, controller.marcarMensajesLeidos);
module.exports = router;
