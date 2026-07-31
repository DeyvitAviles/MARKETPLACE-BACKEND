
const Producto =
    require('../models/Producto');


// =====================================================
// LISTAR TODOS LOS PRODUCTOS
// =====================================================

exports.listarProductos = (req, res) => {

    Producto.obtenerTodos(
        (error, datos) => {

            if (error) {

                console.error(
                    'Error listando productos:',
                    error
                );

                return res.status(500).json({

                    mensaje:
                        'Error al obtener los productos',

                    error:
                        error.message

                });

            }

            return res.status(200).json(
                datos
            );

        }
    );

};


// =====================================================
// CREAR PRODUCTO
// =====================================================

exports.crearProducto = (req, res) => {

    console.log(
        'BODY RECIBIDO:',
        req.body
    );

    console.log(
        'ARCHIVO RECIBIDO:',
        req.file
    );


    const {
        nombre,
        descripcion,
        ubicacion,
        precio,
        stock,
        categoria_id,
        usuario_id
    } = req.body;



    // =================================================
    // VALIDAR CAMPOS
    // =================================================

    if (
        !nombre ||
        !descripcion ||
        !ubicacion ||
        precio === undefined ||
        stock === undefined ||
        !categoria_id
    ) {

        return res.status(400).json({

            mensaje:
                'Faltan campos obligatorios',

            recibido:
                req.body

        });

    }



    // =================================================
    // CONVERTIR DATOS
    // =================================================

    const precioNumero =
        Number(
            String(precio)
                .replace(',', '.')
                .trim()
        );


    const stockNumero =
        Number(stock);


    const categoriaIdNumero =
        Number(categoria_id);



    const usuarioIdNumero =
        Number(usuario_id);



    // =================================================
    // VALIDAR PRECIO
    // =================================================

    if (
        Number.isNaN(precioNumero) ||
        precioNumero <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El precio no es válido'

        });

    }



    // =================================================
    // VALIDAR STOCK
    // =================================================

    if (
        Number.isNaN(stockNumero) ||
        stockNumero < 0
    ) {

        return res.status(400).json({

            mensaje:
                'El stock no es válido'

        });

    }



    // =================================================
    // VALIDAR CATEGORIA
    // =================================================

    if (
        Number.isNaN(categoriaIdNumero) ||
        categoriaIdNumero <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'La categoría no es válida'

        });

    }



    // =================================================
    // VALIDAR USUARIO
    // =================================================

    if (
        Number.isNaN(usuarioIdNumero) ||
        usuarioIdNumero <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }



    // =================================================
    // CREAR OBJETO PRODUCTO
    // =================================================

const producto = {

    nombre:
        nombre.trim(),

    descripcion:
        descripcion.trim(),

    ubicacion:
        ubicacion.trim(),

    precio:
        precioNumero,

    stock:
        stockNumero,

    categoria_id:
        categoriaIdNumero,

    usuario_id:
        usuarioIdNumero,

    imagen:
        req.file
            ? `/uploads/${req.file.filename}`
            : null

};



    console.log(
        'PRODUCTO A GUARDAR:',
        producto
    );



    // =================================================
    // GUARDAR
    // =================================================

    Producto.crear(

        producto,

        (error, resultado) => {


            if (error) {

                console.error(
                    'Error creando producto:',
                    error
                );


                return res.status(500).json({

                    mensaje:
                        'No se pudo crear el producto',

                    error:
                        error.message

                });

            }



            return res.status(201).json({

                mensaje:
                    'Producto creado correctamente',

                id:
                    resultado.insertId,

                imagen:
                    producto.imagen

            });


        }

    );


};

// =====================================================
// PRODUCTOS POR USUARIO
// =====================================================

exports.productosPorUsuario = (req, res) => {

    const usuarioId =
        Number(req.params.usuario_id);


    console.log(
        'Buscando productos del usuario:',
        usuarioId
    );


    if (
        Number.isNaN(usuarioId) ||
        usuarioId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }


    Producto.obtenerPorUsuario(
        usuarioId,
        (error, datos) => {

            if (error) {

                console.error(
                    'Error obteniendo productos del usuario:',
                    error
                );

                return res.status(500).json({

                    mensaje:
                        'Error al obtener los productos del usuario',

                    error:
                        error.message

                });

            }

            return res.status(200).json(
                datos
            );

        }
    );

};


// =====================================================
// ACTUALIZAR PRODUCTO
// =====================================================

exports.actualizarProducto = (req, res) => {

    const productoId =
        Number(req.params.id);


    const {
        nombre,
        descripcion,
        ubicacion,
        precio,
        stock,
        categoria_id,
        usuario_id
    } = req.body;


    // =================================================
    // VALIDAR ID PRODUCTO
    // =================================================

    if (
        Number.isNaN(productoId) ||
        productoId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El producto no es válido'

        });

    }


    // =================================================
    // VALIDAR USUARIO
    // =================================================

    if (
        !usuario_id
    ) {

        return res.status(400).json({

            mensaje:
                'Falta el usuario propietario del producto'

        });

    }


    // =================================================
    // VALIDAR CAMPOS
    // =================================================

    if (
        !nombre ||
        !descripcion ||
        !ubicacion ||
        precio === undefined ||
        stock === undefined ||
        !categoria_id
    ) {

        return res.status(400).json({

            mensaje:
                'Todos los campos son obligatorios'

        });

    }


    // =================================================
    // CONVERTIR DATOS
    // =================================================

    const usuarioIdNumero =
        Number(usuario_id);


    const precioNumero =
        Number(
            String(precio)
                .replace(',', '.')
                .trim()
        );


    const stockNumero =
        Number(stock);


    const categoriaIdNumero =
        Number(categoria_id);


    // =================================================
    // VALIDAR USUARIO
    // =================================================

    if (
        Number.isNaN(usuarioIdNumero) ||
        usuarioIdNumero <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }


    // =================================================
    // VALIDAR PRECIO
    // =================================================

    if (
        Number.isNaN(precioNumero) ||
        precioNumero <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El precio no es válido'

        });

    }


    // =================================================
    // VALIDAR STOCK
    // =================================================

    if (
        Number.isNaN(stockNumero) ||
        stockNumero < 0
    ) {

        return res.status(400).json({

            mensaje:
                'El stock no es válido'

        });

    }


    // =================================================
    // VALIDAR CATEGORÍA
    // =================================================

    if (
        Number.isNaN(categoriaIdNumero) ||
        categoriaIdNumero <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'La categoría no es válida'

        });

    }


    // =================================================
    // CREAR OBJETO PRODUCTO
    // =================================================

    const producto = {

    nombre:
        nombre.trim(),

    descripcion:
        descripcion.trim(),

    ubicacion:
        ubicacion.trim(),

    precio:
        precioNumero,

    stock:
        stockNumero,

    categoria_id:
        categoriaIdNumero,

    usuario_id:
        usuarioIdNumero,

    imagen:
        req.file
            ? `/uploads/${req.file.filename}`
            : null

};


    // =================================================
    // ACTUALIZAR
    // =================================================

    Producto.actualizar(
        productoId,
        producto,
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error actualizando producto:',
                    error
                );

                return res.status(500).json({

                    mensaje:
                        'No se pudo actualizar el producto',

                    error:
                        error.message

                });

            }


            if (
                !resultado ||
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({

                    mensaje:
                        'El producto no existe o no pertenece al usuario'

                });

            }


            return res.status(200).json({

                mensaje:
                    'Producto actualizado correctamente',

                id:
                    productoId

            });

        }
    );

};


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

exports.eliminarProducto = (req, res) => {

    const productoId =
        Number(req.params.id);


    const usuarioId =
        Number(req.body.usuario_id);


    // =================================================
    // VALIDAR PRODUCTO
    // =================================================

    if (
        Number.isNaN(productoId) ||
        productoId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El producto no es válido'

        });

    }


    // =================================================
    // VALIDAR USUARIO
    // =================================================

    if (
        Number.isNaN(usuarioId) ||
        usuarioId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }


    // =================================================
    // ELIMINAR
    // =================================================

    Producto.eliminar(
        productoId,
        usuarioId,
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error eliminando producto:',
                    error
                );


                if (
                    error.code ===
                    'ER_ROW_IS_REFERENCED_2'
                ) {

                    return res.status(409).json({

                        mensaje:
                            'No se puede eliminar el producto porque tiene conversaciones relacionadas'

                    });

                }


                return res.status(500).json({

                    mensaje:
                        'No se pudo eliminar el producto',

                    error:
                        error.message

                });

            }


            if (
                !resultado ||
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({

                    mensaje:
                        'El producto no existe o no pertenece al usuario'

                });

            }


            return res.status(200).json({

                mensaje:
                    'Producto eliminado correctamente'

            });

        }
    );

};
 