const db = require('../config/database');

// ==========================================
// OBTENER TODAS LAS CATEGORÍAS
// ==========================================

exports.obtenerCategorias = (req, res) => {

    const sql = `
        SELECT 
            c.id,
            c.nombre,
            c.descripcion,
            COUNT(p.id) AS productos
        FROM categorias c
        LEFT JOIN productos p
            ON p.categoria_id = c.id
        GROUP BY 
            c.id,
            c.nombre,
            c.descripcion
        ORDER BY c.id DESC
    `;

    db.query(sql, (error, resultados) => {

        if (error) {

            console.error(
                'Error al obtener categorías:',
                error
            );

            return res.status(500).json({
                mensaje: 'Error al obtener las categorías'
            });

        }

        res.json(resultados);

    });

};


// ==========================================
// CREAR CATEGORÍA
// ==========================================

exports.crearCategoria = (req, res) => {

    const {
        nombre,
        descripcion
    } = req.body;


    if (!nombre || !descripcion) {

        return res.status(400).json({
            mensaje: 'El nombre y la descripción son obligatorios'
        });

    }


    const sql = `
        INSERT INTO categorias
        (nombre, descripcion)
        VALUES (?, ?)
    `;


    db.query(
        sql,
        [
            nombre,
            descripcion
        ],
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error al crear categoría:',
                    error
                );

                return res.status(500).json({
                    mensaje: 'Error al crear la categoría'
                });

            }


            res.status(201).json({

                mensaje:
                    'Categoría creada correctamente',

                categoria: {

                    id:
                        resultado.insertId,

                    nombre,

                    descripcion,

                    productos: 0

                }

            });

        }
    );

};


// ==========================================
// ACTUALIZAR CATEGORÍA
// ==========================================

exports.actualizarCategoria = (req, res) => {

    const {
        id
    } = req.params;


    const {
        nombre,
        descripcion
    } = req.body;


    if (!nombre || !descripcion) {

        return res.status(400).json({
            mensaje:
                'El nombre y la descripción son obligatorios'
        });

    }


    const sql = `
        UPDATE categorias
        SET
            nombre = ?,
            descripcion = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            nombre,
            descripcion,
            id
        ],
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error al actualizar categoría:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al actualizar la categoría'
                });

            }


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Categoría no encontrada'
                });

            }


            res.json({

                mensaje:
                    'Categoría actualizada correctamente'

            });

        }
    );

};


// ==========================================
// ELIMINAR CATEGORÍA
// ==========================================

exports.eliminarCategoria = (req, res) => {

    const {
        id
    } = req.params;


    const sql = `
        DELETE FROM categorias
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error al eliminar categoría:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al eliminar la categoría'
                });

            }


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Categoría no encontrada'
                });

            }


            res.json({

                mensaje:
                    'Categoría eliminada correctamente'

            });

        }
    );

};