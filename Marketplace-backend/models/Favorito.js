const conexion =
    require('../config/database');


const Favorito = {


    // =================================================
    // AGREGAR PRODUCTO A FAVORITOS
    // =================================================

    agregar: (
        usuarioId,
        productoId,
        resultado
    ) => {

        const sql = `
            INSERT INTO favoritos
            (
                usuario_id,
                producto_id
            )
            VALUES (?, ?)
        `;

        conexion.query(
            sql,
            [
                usuarioId,
                productoId
            ],
            resultado
        );

    },


    // =================================================
    // OBTENER FAVORITOS DE UN USUARIO
    // =================================================

    obtenerPorUsuario: (
        usuarioId,
        resultado
    ) => {

        const sql = `
    SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.categoria,
        p.categoria_id,
        p.imagen,
        p.estado,
        p.fecha_publicacion,
        p.usuario_id,
        p.cantidad_favoritos,
        u.nombre AS vendedor,
        u.telefono,
        1 AS favorito
    FROM favoritos f
    INNER JOIN productos p
        ON f.producto_id = p.id
    INNER JOIN usuarios u
        ON p.usuario_id = u.id
    WHERE f.usuario_id = ?
    ORDER BY f.id DESC
`;

        conexion.query(
            sql,
            [usuarioId],
            resultado
        );

    },


    // =================================================
    // VERIFICAR SI UN PRODUCTO ES FAVORITO
    // =================================================

    verificar: (
        usuarioId,
        productoId,
        resultado
    ) => {

        const sql = `
            SELECT
                id
            FROM favoritos
            WHERE usuario_id = ?
            AND producto_id = ?
            LIMIT 1
        `;

        conexion.query(
            sql,
            [
                usuarioId,
                productoId
            ],
            resultado
        );

    },


    // =================================================
    // ELIMINAR PRODUCTO DE FAVORITOS
    // =================================================

    eliminar: (
        usuarioId,
        productoId,
        resultado
    ) => {

        const sql = `
            DELETE FROM favoritos
            WHERE usuario_id = ?
            AND producto_id = ?
        `;

        conexion.query(
            sql,
            [
                usuarioId,
                productoId
            ],
            resultado
        );

    },


    // =================================================
    // CONTAR FAVORITOS DE UN PRODUCTO
    // =================================================

    contarPorProducto: (
        productoId,
        resultado
    ) => {

        const sql = `
            SELECT
                COUNT(*) AS cantidad
            FROM favoritos
            WHERE producto_id = ?
        `;

        conexion.query(
            sql,
            [productoId],
            resultado
        );

    }


};


module.exports =
    Favorito;