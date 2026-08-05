const Chat =
require('../models/Chat');


// =====================================================
// CREAR CONVERSACIÓN
// =====================================================

exports.crearConversacion =
(req, res) => {

    let { usuario1_id, usuario2_id, producto_id } = req.body;

    if (req.usuario) usuario1_id = req.usuario.id;


    if (

        !usuario1_id ||

        !usuario2_id ||

        !producto_id

    ) {

        return res.status(
            400
        ).json({

            mensaje:
                'Faltan datos para crear la conversación'

        });

    }


    Chat.crearConversacion(

        usuario1_id,

        usuario2_id,

        producto_id,

        (error, datos) => {

            if (error) {

                console.error(
                    error
                );

                return res.status(
                    500
                ).json({

                    mensaje:
                        'Error al crear conversación',

                    error:
                        error.message || error

                });

            }


            return res.status(
                201
            ).json({

                mensaje:
                    'Conversación creada correctamente',

                conversacion:
                    datos

            });

        }

    );

};


// =====================================================
// OBTENER CONVERSACIONES DEL USUARIO
// =====================================================

exports.obtenerConversaciones =
(req, res) => {

    const usuario_id =
        req.usuario?.id || req.params.usuario_id;


    Chat.obtenerConversaciones(

        usuario_id,

        (error, datos) => {

            if (error) {

                console.error(
                    error
                );

                return res.status(
                    500
                ).json({

                    mensaje:
                        'Error al obtener conversaciones',

                    error:
                        error.message || error

                });

            }


            return res.json(
                datos
            );

        }

    );

};


// =====================================================
// OBTENER UNA CONVERSACIÓN
// =====================================================

exports.obtenerConversacion =
(req, res) => {

    const id =
        req.params.id;


    Chat.obtenerConversacion(

        id,

        (error, datos) => {

            if (error) {

                console.error(
                    error
                );

                return res.status(
                    500
                ).json({

                    mensaje:
                        'Error al obtener conversación',

                    error:
                        error.message || error

                });

            }


            if (

                !datos ||

                datos.length === 0

            ) {

                return res.status(
                    404
                ).json({

                    mensaje:
                        'Conversación no encontrada'

                });

            }


            return res.json(
                datos[0]
            );

        }

    );

};


// =====================================================
// ENVIAR MENSAJE DE TEXTO
// =====================================================

exports.enviarMensaje =
(req, res) => {

    let { conversacion_id, emisor_id, mensaje } = req.body;

    if (req.usuario) emisor_id = req.usuario.id;


    if (

        !conversacion_id ||

        !emisor_id ||

        !mensaje

    ) {

        return res.status(
            400
        ).json({

            mensaje:
                'Faltan datos para enviar el mensaje'

        });

    }


    Chat.enviarMensaje(

        conversacion_id,

        emisor_id,

        mensaje,

        (error, resultado) => {

            if (error) {

                console.error(
                    error
                );

                return res.status(
                    500
                ).json({

                    mensaje:
                        'Error al enviar mensaje',

                    error:
                        error.message || error

                });

            }


            return res.status(
                201
            ).json({

                mensaje:
                    'Mensaje enviado correctamente',

                id:
                    resultado.insertId,

                conversacion_id:
                    conversacion_id,

                emisor_id:
                    emisor_id,

                contenido:
                    mensaje,

                tipo:
                    'texto'

            });

        }

    );

};


// =====================================================
// ENVIAR IMAGEN
// =====================================================

exports.enviarImagen =
(req, res) => {

    const conversacion_id =
        req.body.conversacion_id;

    const emisor_id =
        req.usuario?.id || req.body.emisor_id;


    if (

        !conversacion_id ||

        !emisor_id

    ) {

        return res.status(
            400
        ).json({

            mensaje:
                'Faltan datos para enviar imagen'

        });

    }


    if (
        !req.file
    ) {

        return res.status(
            400
        ).json({

            mensaje:
                'No se recibió ninguna imagen'

        });

    }


    const imagen =
        `/uploads/chats/${req.file.filename}`;


    Chat.enviarImagen(

        conversacion_id,

        emisor_id,

        imagen,

        (error, resultado) => {

            if (error) {

                console.error(

                    'Error al guardar imagen:',

                    error

                );

                return res.status(
                    500
                ).json({

                    mensaje:
                        'Error al guardar imagen',

                    error:
                        error.message || error

                });

            }


            return res.status(
                201
            ).json({

                mensaje:
                    imagen,

                texto:
                    'Imagen enviada correctamente',

                id:
                    resultado.insertId,

                conversacion_id:
                    conversacion_id,

                emisor_id:
                    emisor_id,

                imagen:
                    imagen,

                tipo:
                    'imagen'

            });

        }

    );

};


// =====================================================
// OBTENER MENSAJES
// =====================================================

exports.obtenerMensajes =
(req, res) => {

    const conversacion_id =
        req.params.conversacion_id;


    Chat.obtenerMensajes(

        conversacion_id,

        (error, datos) => {

            if (error) {

                console.error(
                    error
                );

                return res.status(
                    500
                ).json({

                    mensaje:
                        'Error al obtener mensajes',

                    error:
                        error.message || error

                });

            }


            return res.json(
                datos
            );

        }

    );

};


// =====================================================
// MARCAR MENSAJES COMO LEÍDOS
// =====================================================

exports.marcarMensajesLeidos =
(req, res) => {

    const conversacion_id =
        req.params.conversacion_id;

    const usuario_id =
        req.usuario?.id || req.body.usuario_id;


    if (
        !usuario_id
    ) {

        return res.status(
            400
        ).json({

            mensaje:
                'Falta el usuario_id'

        });

    }


    Chat.marcarMensajesLeidos(

        conversacion_id,

        usuario_id,

        (error, resultado) => {

            if (error) {

                console.error(

                    'Error al marcar mensajes:',

                    error

                );

                return res.status(
                    500
                ).json({

                    mensaje:
                        'Error al marcar mensajes como leídos',

                    error:
                        error.message || error

                });

            }


            return res.json({

                mensaje:
                    'Mensajes marcados como leídos',

                afectados:
                    resultado.affectedRows

            });

        }

    );

    

};