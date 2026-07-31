const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const productosController =
    require('../controllers/productos.controller');


// =====================================================
// CARPETA UPLOADS
// =====================================================

const carpetaUploads =
    path.join(
        __dirname,
        '..',
        'uploads'
    );

if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(
        carpetaUploads,
        {
            recursive: true
        }
    );
}


// =====================================================
// CONFIGURACIÓN DE MULTER
// =====================================================

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {
        console.log(
            'Carpeta de destino:',
            carpetaUploads
        );

        cb(
            null,
            carpetaUploads
        );
    },

    filename: function (
        req,
        file,
        cb
    ) {
        const extension =
            path.extname(
                file.originalname
            );

        const nombreArchivo =
            `${Date.now()}${extension}`;

        console.log(
            'Archivo que se guardará:',
            nombreArchivo
        );

        cb(
            null,
            nombreArchivo
        );
    }

});


const upload = multer({

    storage,

    limits: {
        fileSize:
            50 * 1024 * 1024
    },

    fileFilter: function (
    req,
    file,
    cb
) {

    const extensionesPermitidas = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp',
        '.gif'
    ];

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();


    if (
        !extensionesPermitidas.includes(
            extension
        )
    ) {

        return cb(
            new Error(
                'Solo se permiten imágenes JPG, JPEG, PNG, WEBP o GIF'
            )
        );

    }


    cb(
        null,
        true
    );

}

});


// =====================================================
// LISTAR TODOS LOS PRODUCTOS
// =====================================================

router.get(
    '/',
    productosController.listarProductos
);


// =====================================================
// CREAR PRODUCTO
// =====================================================

router.post(
    '/',
    upload.single('imagen'),
    productosController.crearProducto
);


// =====================================================
// PRODUCTOS POR USUARIO
// =====================================================

router.get(
    '/usuario/:usuario_id',
    productosController.productosPorUsuario
);


// =====================================================
// ACTUALIZAR PRODUCTO
// =====================================================

router.put(
    '/:id',
    upload.single('imagen'),
    productosController.actualizarProducto
);


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

router.delete(
    '/:id',
    productosController.eliminarProducto
);


module.exports = router;