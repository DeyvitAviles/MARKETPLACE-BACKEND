const express = require('express');

const cors = require('cors');

const path = require('path');

const http = require('http');

const { Server } =
    require('socket.io');

const multer = require('multer');


const app =
    express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors()
);

app.use(
    express.json()
);



app.use(
    express.urlencoded({
        extended: true
    })
);

// =====================================================
// BASE DE DATOS
// =====================================================

require(
    './config/database'
);



// =====================================================
// RUTAS
// =====================================================

const usuariosRoutes =
    require(
        './routes/usuarios.routes'
    );

const productosRoutes =
    require(
        './routes/productos.routes'
    );

const chatsRoutes =
    require(
        './routes/chats.routes'
    );
const favoritosRoutes =
    require(
        './routes/favoritosRoutes'
    );

const categoriaRoutes =
    require(
        './routes/categoriaRoutes'
    );

app.use(
    '/usuarios',
    usuariosRoutes
);

app.use(
    '/productos',
    productosRoutes
);

app.use(
    '/chats',
    chatsRoutes
);

app.use(
    '/favoritos',
    favoritosRoutes
);

app.use(
    '/categorias',
    categoriaRoutes
);



// =====================================================
// IMÁGENES
// =====================================================

app.use(

    '/uploads',

    express.static(

        path.join(

            __dirname,

            'uploads'

        )

    )

);


// =====================================================
// RUTA PRINCIPAL
// =====================================================

app.get(
    '/',
    (req, res) => {

        res.json({

            mensaje:
                'API Marketplace funcionando'

        });

    }
);

// =====================================================
// MANEJO DE ERRORES
// =====================================================

app.use(

    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            'Error del servidor:',
            error
        );


        if (
            error instanceof
            multer.MulterError
        ) {

            return res.status(
                400
            ).json({

                error:
                    true,

                mensaje:
                    error.message

            });

        }


        return res.status(
            error.status || 500
        ).json({

            error:
                true,

            mensaje:

                error.message ||

                'Error interno del servidor'

        });

    }

);

// =====================================================
// SERVIDOR HTTP
// =====================================================

const server =
    http.createServer(
        app
    );


// =====================================================
// SOCKET.IO
// =====================================================

const io =
    new Server(

        server,

        {

            cors: {

                origin: '*',

                methods: [
                    'GET',
                    'POST'
                ]

            }

        }

    );


// =====================================================
// SOCKET CHAT
// =====================================================

const configurarChatSocket =
    require(
        './socket/chat.socket'
    );

const Chat =
    require(
        './models/Chat'
    );


configurarChatSocket(
    io,
    Chat
);


// =====================================================
// INICIAR
// =====================================================

const PORT =
    3000;


server.listen(

    PORT,

    () => {

        console.log(

            `Servidor ejecutándose en ` +
            `http://localhost:${PORT}`

        );

    }

    

);