const Favorito =
    require('../models/Favorito');


// =====================================================
// AGREGAR FAVORITO
// =====================================================

exports.agregarFavorito = (req, res) => {

    const {
    usuario_id,
    producto_id
} = req.body || {};

const usuarioId =
    Number(req.usuario?.id || usuario_id);

const productoId =
    Number(producto_id);

    if (
        Number.isNaN(usuarioId) ||
        usuarioId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }


    if (
        Number.isNaN(productoId) ||
        productoId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El producto no es válido'

        });

    }


    Favorito.agregar(
        usuarioId,
        productoId,
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error agregando favorito:',
                    error
                );


                if (
                    error.code ===
                    'ER_DUP_ENTRY'
                ) {

                    return res.status(409).json({

                        mensaje:
                            'El producto ya está en favoritos'

                    });

                }


                if (
                    error.code ===
                    'ER_NO_REFERENCED_ROW_2'
                ) {

                    return res.status(404).json({

                        mensaje:
                            'El usuario o el producto no existe'

                    });

                }


                return res.status(500).json({

                    mensaje:
                        'No se pudo agregar el favorito',

                    error:
                        error.message

                });

            }


            return res.status(201).json({

                mensaje:
                    'Producto agregado a favoritos',

                favorito: true,

                id:
                    resultado.insertId

            });

        }
    );

};


// =====================================================
// OBTENER FAVORITOS DEL USUARIO
// =====================================================

exports.obtenerFavoritosUsuario = (req, res) => {

    const usuarioId =
        Number(req.usuario?.id || req.params.usuario_id);


    if (
        Number.isNaN(usuarioId) ||
        usuarioId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }


    Favorito.obtenerPorUsuario(
        usuarioId,
        (error, datos) => {

            if (error) {

                console.error(
                    'Error obteniendo favoritos:',
                    error
                );

                return res.status(500).json({

                    mensaje:
                        'No se pudieron obtener los favoritos',

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
// VERIFICAR FAVORITO
// =====================================================

exports.verificarFavorito = (req, res) => {

    const usuarioId =
        Number(req.usuario?.id || req.params.usuario_id);

    const productoId =
        Number(req.params.producto_id);


    if (
        Number.isNaN(usuarioId) ||
        usuarioId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }


    if (
        Number.isNaN(productoId) ||
        productoId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El producto no es válido'

        });

    }


    Favorito.verificar(
        usuarioId,
        productoId,
        (error, datos) => {

            if (error) {

                console.error(
                    'Error verificando favorito:',
                    error
                );

                return res.status(500).json({

                    mensaje:
                        'No se pudo verificar el favorito',

                    error:
                        error.message

                });

            }


            const esFavorito =
                datos.length > 0;


            return res.status(200).json({

                favorito:
                    esFavorito

            });

        }
    );

};


// =====================================================
// ELIMINAR FAVORITO
// =====================================================

exports.eliminarFavorito = (req, res) => {

    const usuarioId =
        Number(req.usuario?.id || req.params.usuario_id);

    const productoId =
        Number(req.params.producto_id);


    if (
        Number.isNaN(usuarioId) ||
        usuarioId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El usuario no es válido'

        });

    }


    if (
        Number.isNaN(productoId) ||
        productoId <= 0
    ) {

        return res.status(400).json({

            mensaje:
                'El producto no es válido'

        });

    }


    Favorito.eliminar(
        usuarioId,
        productoId,
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error eliminando favorito:',
                    error
                );

                return res.status(500).json({

                    mensaje:
                        'No se pudo eliminar el favorito',

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
                        'El producto no estaba en favoritos',

                    favorito:
                        false

                });

            }


            return res.status(200).json({

                mensaje:
                    'Producto eliminado de favoritos',

                favorito:
                    false

            });

        }
    );

};