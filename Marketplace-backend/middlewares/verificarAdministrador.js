const Usuario = require('../models/Usuario');

const verificarAdministrador = (
    req,
    res,
    next
) => {

    const usuarioId =
        req.headers['usuario-id'];

    if (!usuarioId) {
        return res.status(401).json({
            mensaje:
                'No se proporcionó el usuario administrador'
        });
    }

    Usuario.obtenerUsuarioPorId(
        usuarioId,
        (error, datos) => {

            if (error) {
                console.error(
                    'Error verificando administrador:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al verificar permisos'
                });
            }

            if (datos.length === 0) {
                return res.status(401).json({
                    mensaje:
                        'Usuario no encontrado'
                });
            }

            const usuario =
                datos[0];

            if (
                usuario.rol !==
                'administrador'
            ) {
                return res.status(403).json({
                    mensaje:
                        'No tienes permisos de administrador'
                });
            }

            if (
                Number(usuario.activo) !== 1 ||
                usuario.estado !== 'activo'
            ) {
                return res.status(403).json({
                    mensaje:
                        'La cuenta del administrador no está activa'
                });
            }

            req.usuarioAdministrador =
                usuario;

            next();
        }
    );
};

module.exports =
    verificarAdministrador;