function configurarChatSocket(io, Chat) {

    // =====================================================
    // USUARIOS CONECTADOS
    //
    // usuarioId -> cantidad de sockets activos
    //
    // Ejemplo:
    //
    // Usuario 1 -> 1 conexión
    // Usuario 2 -> 1 conexión
    //
    // Si el mismo usuario abre dos dispositivos:
    //
    // Usuario 1 -> 2 conexiones
    //
    // =====================================================

    const conexionesUsuarios = new Map();


    // =====================================================
    // MARCAR USUARIO ONLINE
    // =====================================================

    function marcarUsuarioOnline(usuarioId) {

        const cantidadActual =
            conexionesUsuarios.get(usuarioId) || 0;


        // Aumentar cantidad de conexiones

        conexionesUsuarios.set(
            usuarioId,
            cantidadActual + 1
        );


        console.log(
            `🟢 SOCKET ONLINE -> Usuario ${usuarioId} | ` +
            `Conexiones activas: ${cantidadActual + 1}`
        );


        // =================================================
        // SOLO ACTUALIZAR MYSQL SI ES LA PRIMERA CONEXIÓN
        // =================================================

        if (cantidadActual === 0) {

            Chat.actualizarEstadoUsuario(

                usuarioId,

                1,

                (error) => {

                    if (error) {

                        console.error(
                            '❌ Error usuario online:',
                            error
                        );

                        return;

                    }


                    console.log(
                        `🟢 Usuario ${usuarioId} ONLINE`
                    );


                    // Avisar a TODOS los clientes
                    // que este usuario está online

                    io.emit(

                        'user_status',

                        {

                            usuarioId:
                                usuarioId,

                            activo:
                                true

                        }

                    );

                }

            );

        }

    }



    // =====================================================
    // MARCAR USUARIO OFFLINE
    // =====================================================

    function marcarUsuarioOffline(usuarioId) {

        const cantidadActual =
            conexionesUsuarios.get(usuarioId) || 0;


        console.log(

            `🔌 Desconexión detectada -> ` +
            `Usuario ${usuarioId} | ` +
            `Conexiones antes: ${cantidadActual}`

        );


        // =================================================
        // SI SOLO TENÍA UNA CONEXIÓN
        // =================================================

        if (cantidadActual <= 1) {


            // Eliminar del Map

            conexionesUsuarios.delete(
                usuarioId
            );


            console.log(

                `🔴 Usuario ${usuarioId} ` +
                `ya no tiene conexiones activas`

            );


            // =================================================
            // ACTUALIZAR MYSQL A OFFLINE
            // =================================================

            Chat.actualizarEstadoUsuario(

                usuarioId,

                0,

                (error) => {

                    if (error) {

                        console.error(

                            '❌ Error usuario offline:',

                            error

                        );

                        return;

                    }


                    console.log(

                        `🔴 Usuario ${usuarioId} OFFLINE`

                    );


                    // Avisar a todos

                    io.emit(

                        'user_status',

                        {

                            usuarioId:
                                usuarioId,

                            activo:
                                false

                        }

                    );

                }

            );

        }


        // =================================================
        // SI TODAVÍA TIENE OTRAS CONEXIONES
        // =================================================

        else {


            const nuevasConexiones =
                cantidadActual - 1;


            conexionesUsuarios.set(

                usuarioId,

                nuevasConexiones

            );


            console.log(

                `🟢 Usuario ${usuarioId} ` +
                `SIGUE ONLINE | ` +
                `Conexiones activas: ${nuevasConexiones}`

            );


            // IMPORTANTE:
            //
            // NO enviamos user_status false
            //
            // porque todavía existe otra conexión activa.

        }

    }



    // =====================================================
    // CONEXIÓN SOCKET.IO
    // =====================================================

    io.on(

        'connection',

        (socket) => {


            console.log(

                '🔵 NUEVO SOCKET CONECTADO:',

                socket.id

            );


            // =================================================
            // USUARIO ONLINE
            // =================================================

            socket.on(

                'user_online',

                (data) => {


                    const usuarioId =

                        Number(

                            data.usuarioId

                        );


                    // Validar usuario

                    if (!usuarioId) {

                        console.log(

                            '⚠️ user_online sin usuarioId'

                        );

                        return;

                    }


                    // =================================================
                    // EVITAR REGISTRAR DOS VECES EL MISMO SOCKET
                    // =================================================

                    if (socket.usuarioId) {

                        console.log(

                            `⚠️ Socket ${socket.id} ` +

                            `ya pertenece al usuario ` +

                            `${socket.usuarioId}`

                        );

                        return;

                    }


                    // Guardar usuario dentro del socket

                    socket.usuarioId =

                        usuarioId;


                    console.log(

                        `📱 Socket ${socket.id} ` +

                        `pertenece al usuario ${usuarioId}`

                    );


                    // Marcar online

                    marcarUsuarioOnline(

                        usuarioId

                    );

                }

            );



            // =================================================
            // ENTRAR A UNA CONVERSACIÓN
            // =================================================

            socket.on(

                'join_chat',

                (data) => {


                    const usuarioId =

                        Number(

                            data.usuarioId

                        );


                    const otroUsuarioId =

                        Number(

                            data.otroUsuarioId

                        );


                    if (!usuarioId) {

                        return;

                    }


                    // =================================================
                    // SI EL SOCKET TODAVÍA NO TIENE USUARIO
                    // =================================================

                    if (!socket.usuarioId) {


                        socket.usuarioId =

                            usuarioId;


                        marcarUsuarioOnline(

                            usuarioId

                        );

                    }


                    // =================================================
                    // ORDENAR USUARIOS
                    // =================================================

                    const usuarios = [

                        usuarioId,

                        otroUsuarioId

                    ].sort(

                        (a, b) => a - b

                    );


                    // =================================================
                    // CREAR SALA
                    // =================================================

                    const sala =

                        `chat_${usuarios[0]}_${usuarios[1]}`;


                    // Entrar a la sala

                    socket.join(

                        sala

                    );


                    console.log(

                        `💬 Usuario ${usuarioId} ` +

                        `entró a la sala ${sala}`

                    );

                }

            );



            // =================================================
            // ENVIAR MENSAJE
            // =================================================

            socket.on(

                'send_message',

                (data) => {


                    const usuarioId =

                        Number(

                            data.usuarioId

                        );


                    const otroUsuarioId =

                        Number(

                            data.otroUsuarioId

                        );


                    // Ordenar usuarios

                    const usuarios = [

                        usuarioId,

                        otroUsuarioId

                    ].sort(

                        (a, b) => a - b

                    );


                    // Crear sala

                    const sala =

                        `chat_${usuarios[0]}_${usuarios[1]}`;


                    console.log(

                        '💬 Mensaje socket:',

                        data.mensaje

                    );


                    // Enviar mensaje

                    io.to(

                        sala

                    ).emit(

                        'receive_message',

                        {


                            id:

                                data.id,


                            conversacionId:

                                data.conversacionId,


                            usuarioId:

                                usuarioId,


                            mensaje:

                                data.mensaje,


                            imagen:

                                data.imagen,


                            tipo:

                                data.tipo ||

                                'texto',


                            fecha:

                                data.fecha ||

                                new Date()

                                    .toISOString()

                        }

                    );

                }

            );



            // =================================================
            // MENSAJES LEÍDOS
            // =================================================

            socket.on(

                'messages_read',

                (data) => {


                    const usuarioId =

                        Number(

                            data.usuarioId

                        );


                    const otroUsuarioId =

                        Number(

                            data.otroUsuarioId

                        );


                    // Ordenar usuarios

                    const usuarios = [

                        usuarioId,

                        otroUsuarioId

                    ].sort(

                        (a, b) => a - b

                    );


                    // Crear sala

                    const sala =

                        `chat_${usuarios[0]}_${usuarios[1]}`;


                    // Avisar al otro usuario

                    socket.to(

                        sala

                    ).emit(

                        'messages_read',

                        {


                            usuarioId:

                                usuarioId,


                            conversacionId:

                                data.conversacionId

                        }

                    );

                }

            );



            // =================================================
            // DESCONECTAR SOCKET
            // =================================================

            socket.on(

                'disconnect',

                () => {


                    console.log(

                        '🔌 SOCKET DESCONECTADO:',

                        socket.id

                    );


                    // Obtener usuario

                    const usuarioId =

                        socket.usuarioId;


                    // Si el socket nunca fue asociado
                    // a ningún usuario

                    if (!usuarioId) {

                        console.log(

                            '⚠️ Socket sin usuario asociado'

                        );

                        return;

                    }


                    console.log(

                        `🔌 Usuario ${usuarioId} ` +

                        `cerró una conexión`

                    );


                    // Reducir conexiones

                    marcarUsuarioOffline(

                        usuarioId

                    );

                }

            );

        }

    );

}


module.exports =

    configurarChatSocket;