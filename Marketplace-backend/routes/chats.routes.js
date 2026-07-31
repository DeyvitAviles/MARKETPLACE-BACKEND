const express = require('express');

const router =
express.Router();

const multer =
require('multer');

const path =
require('path');

const chatsController =
require('../controllers/chats.controller');

// =====================================================
// CONFIGURACIÓN MULTER
// =====================================================

const storage =
multer.diskStorage({

    destination:
        function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                'uploads/chats'
            );

        },

    filename:
        function (
            req,
            file,
            cb
        ) {

            const extension =
                path.extname(
                    file.originalname
                );

            const nombre =
                Date.now() +
                '-' +
                Math.round(
                    Math.random() * 100000
                ) +
                extension;

            cb(
                null,
                nombre
            );

        }

});


const upload =
multer({

    storage:

        storage,

    fileFilter:

        function (
            req,
            file,
            cb
        ) {

            const permitidos = [

                'image/jpeg',

                'image/png',

                'image/jpg',

                'image/webp'

            ];

            if (
                permitidos.includes(
                    file.mimetype
                )
            ) {

                cb(
                    null,
                    true
                );

            } else {

                cb(
                    new Error(
                        'Solo se permiten imágenes'
                    )
                );

            }

        }

});


// =====================================================
// CREAR CONVERSACIÓN
// =====================================================

router.post(
'/conversacion',
chatsController.crearConversacion
);

// =====================================================
// OBTENER CONVERSACIONES DEL USUARIO
// =====================================================

router.get(
'/usuario/:usuario_id',
chatsController.obtenerConversaciones
);

// =====================================================
// OBTENER UNA CONVERSACIÓN
// =====================================================

router.get(
'/conversacion/:id',
chatsController.obtenerConversacion
);

// =====================================================
// ENVIAR MENSAJE DE TEXTO
// =====================================================

router.post(
'/mensaje',
chatsController.enviarMensaje
);

// =====================================================
// ENVIAR IMAGEN
// =====================================================

router.post(
'/imagen',
upload.single('imagen'),
chatsController.enviarImagen
);

// =====================================================
// OBTENER MENSAJES
// =====================================================

router.get(
'/mensajes/:conversacion_id',
chatsController.obtenerMensajes
);

// =====================================================
// MARCAR MENSAJES COMO LEÍDOS
// =====================================================

router.put(
'/mensajes/:conversacion_id/leidos',
chatsController.marcarMensajesLeidos
);

// =====================================================
// EXPORTAR ROUTER
// =====================================================

module.exports =
router;