const conexion = require('../config/database');

const Usuario = {

    // =====================================================
    // LISTAR TODOS LOS USUARIOS
    // =====================================================

    obtenerTodos: (resultado) => {

        const sql = `
    SELECT
        id,
        nombre,
        correo,
        rol,
        telefono,
        activo,
        ubicacion,
        imagen_perfil,
        estado
    FROM usuarios
`;

        conexion.query(
            sql,
            resultado
        );

    },


    // =====================================================
    // CREAR USUARIO
    // =====================================================

    crear: (usuario, resultado) => {

        const sql = `
            INSERT INTO usuarios
            (
                nombre,
                correo,
                password,
                telefono,
                ubicacion,
                imagen_perfil
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        conexion.query(
            sql,
            [
                usuario.nombre,
                usuario.correo,
                usuario.password,
                usuario.telefono || '',
                usuario.ubicacion || '',
                usuario.imagen_perfil || ''
            ],
            resultado
        );

    },


    // =====================================================
    // BUSCAR USUARIO POR CORREO
    // =====================================================

    buscarPorCorreo: (
        correo,
        resultado
    ) => {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE correo = ?
        `;

        conexion.query(
            sql,
            [correo],
            resultado
        );

    },


    // =====================================================
    // OBTENER USUARIO POR ID
    // Incluye password únicamente para verificarla internamente
    // =====================================================

    obtenerUsuarioPorId: (
        usuarioId,
        resultado
    ) => {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE id = ?
        `;

        conexion.query(
            sql,
            [usuarioId],
            resultado
        );

    },


    // =====================================================
    // OBTENER PERFIL POR ID
    // No devuelve la contraseña
    // =====================================================

    obtenerPerfilPorId: (
    usuarioId,
    resultado
) => {

    const sql = `
        SELECT
            u.id,
            u.nombre,
            u.correo,

            COALESCE(
                u.telefono,
                ''
            ) AS telefono,

            COALESCE(
                u.ubicacion,
                ''
            ) AS ubicacion,

            COALESCE(
                u.imagen_perfil,
                ''
            ) AS imagen_perfil,

            (
                SELECT COUNT(*)
                FROM productos p
                WHERE p.usuario_id = u.id
            ) AS cantidad_productos,

            0 AS cantidad_favoritos

        FROM usuarios u
        WHERE u.id = ?
    `;

    conexion.query(
        sql,
        [usuarioId],
        resultado
    );
},


    // =====================================================
    // ACTUALIZAR PERFIL
    // No modifica la contraseña
    // =====================================================

    actualizarPerfil: (
        usuarioId,
        datos,
        resultado
    ) => {

        const sql = `
            UPDATE usuarios
            SET
                nombre = ?,
                correo = ?,
                telefono = ?,
                ubicacion = ?,
                imagen_perfil = ?
            WHERE id = ?
        `;

        conexion.query(
            sql,
            [
                datos.nombre,
                datos.correo,
                datos.telefono,
                datos.ubicacion,
                datos.imagen_perfil,
                usuarioId
            ],
            resultado
        );

    },


    // =====================================================
    // CAMBIAR CONTRASEÑA
    // =====================================================

    cambiarPassword: (
        usuarioId,
        nuevaPassword,
        resultado
    ) => {

        const sql = `
            UPDATE usuarios
            SET password = ?
            WHERE id = ?
        `;

        conexion.query(
            sql,
            [
                nuevaPassword,
                usuarioId
            ],
            resultado
        );

    }

};


// =====================================================
// CAMBIAR ESTADO ACTIVO DEL USUARIO
// =====================================================

cambiarEstado: (
    usuarioId,
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
            usuarioId
        ],
        resultado
    );

}
module.exports = Usuario;