const conexion = require('../config/database');

const Chat = {

 
// =====================================================
// CREAR CONVERSACIÓN
// =====================================================

crearConversacion: (
    usuario1_id,
    usuario2_id,
    producto_id,
    resultado
) => {

    const buscarSql = `
        SELECT *
        FROM conversaciones
        WHERE
            (
                (
                    usuario1_id = ?
                    AND usuario2_id = ?
                )
                OR
                (
                    usuario1_id = ?
                    AND usuario2_id = ?
                )
            )
            AND producto_id = ?
        LIMIT 1
    `;

    conexion.query(

        buscarSql,

        [
            usuario1_id,
            usuario2_id,
            usuario2_id,
            usuario1_id,
            producto_id
        ],

        (error, conversaciones) => {

            if (error) {
                return resultado(error);
            }

            // Si ya existe la conversación
            if (conversaciones.length > 0) {

                return resultado(
                    null,
                    conversaciones[0]
                );

            }

            // Crear nueva conversación
            const insertarSql = `
                INSERT INTO conversaciones
                (
                    usuario1_id,
                    usuario2_id,
                    producto_id
                )
                VALUES (?, ?, ?)
            `;

            conexion.query(

                insertarSql,

                [
                    usuario1_id,
                    usuario2_id,
                    producto_id
                ],

                (error, resultadoInsert) => {

                    if (error) {
                        return resultado(error);
                    }

                    resultado(

                        null,

                        {
                            id:
                                resultadoInsert.insertId,

                            usuario1_id:
                                usuario1_id,

                            usuario2_id:
                                usuario2_id,

                            producto_id:
                                producto_id
                        }

                    );

                }

            );

        }

    );

},


// =====================================================
// OBTENER CONVERSACIONES DEL USUARIO
// =====================================================

obtenerConversaciones: (
    usuario_id,
    resultado
) => {

    const sql = `

        SELECT

            c.id,

            c.producto_id,

            c.fecha_creacion,

            p.nombre AS producto,

            CASE

                WHEN c.usuario1_id = ?

                THEN u2.id

                ELSE u1.id

            END AS otro_usuario_id,

            CASE

                WHEN c.usuario1_id = ?

                THEN u2.nombre

                ELSE u1.nombre

            END AS otro_usuario,

            CASE

                WHEN c.usuario1_id = ?

                THEN u2.activo

                ELSE u1.activo

            END AS otro_usuario_activo,

            (

                SELECT m.mensaje

                FROM mensajes m

                WHERE
                    m.conversacion_id = c.id

                ORDER BY
                    m.fecha DESC

                LIMIT 1

            ) AS ultimo_mensaje,

            (

                SELECT m.tipo

                FROM mensajes m

                WHERE
                    m.conversacion_id = c.id

                ORDER BY
                    m.fecha DESC

                LIMIT 1

            ) AS tipo_ultimo_mensaje,

            (

                SELECT m.fecha

                FROM mensajes m

                WHERE
                    m.conversacion_id = c.id

                ORDER BY
                    m.fecha DESC

                LIMIT 1

            ) AS fecha_ultimo_mensaje,

            (

                SELECT COUNT(*)

                FROM mensajes m

                WHERE
                    m.conversacion_id = c.id

                AND m.emisor_id != ?

                AND m.leido = 0

            ) AS mensajes_no_leidos

        FROM conversaciones c

        INNER JOIN productos p
            ON c.producto_id = p.id

        INNER JOIN usuarios u1
            ON c.usuario1_id = u1.id

        INNER JOIN usuarios u2
            ON c.usuario2_id = u2.id

        WHERE

            c.usuario1_id = ?

            OR

            c.usuario2_id = ?

        ORDER BY

            fecha_ultimo_mensaje DESC,

            c.fecha_creacion DESC

    `;

    conexion.query(

        sql,

        [
            usuario_id,
            usuario_id,
            usuario_id,
            usuario_id,
            usuario_id,
            usuario_id
        ],

        resultado

    );

},


// =====================================================
// OBTENER UNA CONVERSACIÓN
// =====================================================

obtenerConversacion: (
    id,
    resultado
) => {

    const sql = `

        SELECT

            c.*,

            p.nombre AS producto,

            u1.nombre AS usuario1,

            u2.nombre AS usuario2

        FROM conversaciones c

        INNER JOIN productos p
            ON c.producto_id = p.id

        INNER JOIN usuarios u1
            ON c.usuario1_id = u1.id

        INNER JOIN usuarios u2
            ON c.usuario2_id = u2.id

        WHERE c.id = ?

    `;

    conexion.query(

        sql,

        [id],

        resultado

    );

},


// =====================================================
// ENVIAR MENSAJE DE TEXTO
// =====================================================

enviarMensaje: (

    conversacion_id,

    emisor_id,

    mensaje,

    resultado

) => {

    const sql = `

        INSERT INTO mensajes
        (
            conversacion_id,
            emisor_id,
            mensaje,
            tipo,
            imagen,
            leido
        )

        VALUES (?, ?, ?, 'texto', NULL, 0)

    `;

    conexion.query(

        sql,

        [
            conversacion_id,
            emisor_id,
            mensaje
        ],

        resultado

    );

},


// =====================================================
// ENVIAR IMAGEN
// =====================================================

enviarImagen: (

    conversacion_id,

    emisor_id,

    imagen,

    resultado

) => {

    const sql = `

        INSERT INTO mensajes
        (
            conversacion_id,
            emisor_id,
            mensaje,
            tipo,
            imagen,
            leido
        )

        VALUES (?, ?, '', 'imagen', ?, 0)

    `;

    conexion.query(

        sql,

        [
            conversacion_id,
            emisor_id,
            imagen
        ],

        resultado

    );

},


// =====================================================
// OBTENER MENSAJES
// =====================================================

obtenerMensajes: (

    conversacion_id,

    resultado

) => {

    const sql = `

        SELECT

            m.id,

            m.conversacion_id,

            m.emisor_id,

            m.mensaje,

            m.tipo,

            m.imagen,

            m.fecha,

            m.leido,

            u.nombre AS emisor

        FROM mensajes m

        INNER JOIN usuarios u
            ON m.emisor_id = u.id

        WHERE

            m.conversacion_id = ?

        ORDER BY

            m.fecha ASC

    `;

    conexion.query(

        sql,

        [conversacion_id],

        resultado

    );

},


// =====================================================
// MARCAR MENSAJES COMO LEÍDOS
// =====================================================

marcarMensajesLeidos: (

    conversacion_id,

    usuario_id,

    resultado

) => {

    const sql = `

        UPDATE mensajes

        SET leido = 1

        WHERE

            conversacion_id = ?

        AND

            emisor_id != ?

        AND

            leido = 0

    `;

    conexion.query(

        sql,

        [
            conversacion_id,
            usuario_id
        ],

        resultado

    );

},


// =====================================================
// CAMBIAR ESTADO DEL USUARIO
// =====================================================

actualizarEstadoUsuario: (

    usuario_id,

    activo,

    resultado

) => {

    const sql = `

        UPDATE usuarios

        SET activo = ?

        WHERE id = ?

    `;

    conexion.query(

        sql,

        [
            activo,
            usuario_id
        ],

        resultado

    );

}


};

module.exports = Chat;