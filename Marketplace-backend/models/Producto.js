const conexion =
    require('../config/database');


const Producto = {

    // =================================================
    // OBTENER TODOS LOS PRODUCTOS
    // =================================================

    obtenerTodos: (resultado) => {

        const sql = `
            SELECT
                p.*,
                u.nombre AS vendedor,
                u.telefono,
                c.nombre AS categoria_nombre
                
            FROM productos p
            INNER JOIN usuarios u
                ON p.usuario_id = u.id
            LEFT JOIN categorias c
                ON p.categoria_id = c.id
            ORDER BY p.fecha_publicacion DESC
        `;

        conexion.query(
            sql,
            resultado
        );

    },


    // =================================================
    // CREAR PRODUCTO
    // =================================================

    crear: (
        producto,
        resultado
    ) => {

        const sql = `
            INSERT INTO productos
            (
                nombre,
                descripcion,
                ubicacion,
                precio,
                stock,
                categoria_id,
                imagen,
                usuario_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        conexion.query(
            sql,
            [
                producto.nombre,
                producto.descripcion,
                producto.ubicacion,
                producto.precio,
                producto.stock,
                producto.categoria_id,
                producto.imagen,
                producto.usuario_id
            ],
            resultado
        );

    },


    // =================================================
    // OBTENER PRODUCTOS POR USUARIO
    // =================================================

    obtenerPorUsuario: (
        usuarioId,
        resultado
    ) => {

        const sql = `
            SELECT
                p.*,
                u.nombre AS vendedor,
                u.telefono,
                c.nombre AS categoria_nombre
            FROM productos p
            INNER JOIN usuarios u
                ON p.usuario_id = u.id
            LEFT JOIN categorias c
                ON p.categoria_id = c.id
            WHERE p.usuario_id = ?
            ORDER BY p.fecha_publicacion DESC
        `;

        conexion.query(
            sql,
            [usuarioId],
            resultado
        );

    },


    // =================================================
    // ACTUALIZAR PRODUCTO DEL PROPIETARIO
    // =================================================

    actualizar: (
    id,
    producto,
    resultado
) => {

    let sql;
    let valores;


    if (producto.imagen) {

        sql = `
            UPDATE productos
            SET
                nombre = ?,
                descripcion = ?,
                ubicacion = ?,
                precio = ?,
                stock = ?,
                categoria_id = ?,
                imagen = ?
            WHERE id = ?
            AND usuario_id = ?
        `;


        valores = [

            producto.nombre,
            producto.descripcion,
            producto.ubicacion,
            producto.precio,
            producto.stock,
            producto.categoria_id,
            producto.imagen,
            id,
            producto.usuario_id

        ];


    } else {

        sql = `
            UPDATE productos
            SET
                nombre = ?,
                descripcion = ?,
                ubicacion = ?,
                precio = ?,
                stock = ?,
                categoria_id = ?
            WHERE id = ?
            AND usuario_id = ?
        `;


        valores = [

            producto.nombre,
            producto.descripcion,
            producto.ubicacion,
            producto.precio,
            producto.stock,
            producto.categoria_id,
            id,
            producto.usuario_id

        ];

    }


    conexion.query(
        sql,
        valores,
        resultado
    );

},


    // =================================================
    // ELIMINAR PRODUCTO DEL PROPIETARIO
    // =================================================

    eliminar: (
        id,
        usuarioId,
        resultado
    ) => {

        const sql = `
            DELETE FROM productos
            WHERE id = ?
            AND usuario_id = ?
        `;

        conexion.query(
            sql,
            [
                id,
                usuarioId
            ],
            resultado
        );

    },


    // =================================================
    // ADMINISTRADOR: ACTUALIZAR CUALQUIER PRODUCTO
    // No cambia el propietario
    // =================================================

    actualizarAdmin: (
        id,
        producto,
        resultado
    ) => {

        const sql = `
            UPDATE productos
            SET
                nombre = ?,
                descripcion = ?,
                ubicacion = ?,
                precio = ?,
                stock = ?,
                categoria_id = ?
            WHERE id = ?
        `;

        conexion.query(
            sql,
            [
                producto.nombre,
                producto.descripcion,
                producto.ubicacion,
                producto.precio,
                producto.stock,
                producto.categoria_id,
                id
            ],
            resultado
        );

    },


    // =================================================
    // ADMINISTRADOR: ELIMINAR CUALQUIER PRODUCTO
    // =================================================

    eliminarAdmin: (
        id,
        resultado
    ) => {

        const sql = `
            DELETE FROM productos
            WHERE id = ?
        `;

        conexion.query(
            sql,
            [id],
            resultado
        );

    }


};


module.exports =
    Producto;