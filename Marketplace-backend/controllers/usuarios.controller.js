const Usuario = require('../models/Usuario');


// =====================================================
// LISTAR USUARIOS
// =====================================================

exports.listarUsuarios = (
    req,
    res
) => {

    Usuario.obtenerTodos(
        (error, datos) => {

            if (error) {

                console.error(
                    'Error al listar usuarios:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al listar usuarios',
                    error:
                        error.message
                });

            }

            res.json(datos);

        }
    );

};


// =====================================================
// CREAR USUARIO
// =====================================================

exports.crearUsuario = (
    req,
    res
) => {

    const {
        nombre,
        correo,
        password,
        telefono,
        ubicacion,
        imagen_perfil
    } = req.body;

    if (
        !nombre ||
        !correo ||
        !password
    ) {

        return res.status(400).json({
            mensaje:
                'Nombre, correo y contraseña son obligatorios'
        });

    }

    const usuario = {
        nombre,
        correo,
        password,
        telefono: telefono || '',
        ubicacion: ubicacion || '',
        imagen_perfil:
            imagen_perfil || ''
    };

    Usuario.crear(
        usuario,
        (error, resultado) => {

            if (error) {

                console.error(
                    'Error al crear usuario:',
                    error
                );

                if (
                    error.code ===
                    'ER_DUP_ENTRY'
                ) {

                    return res.status(409).json({
                        mensaje:
                            'El correo ya está registrado'
                    });

                }

                return res.status(500).json({
                    mensaje:
                        'Error al crear usuario',
                    error:
                        error.message
                });

            }

            res.status(201).json({
                mensaje:
                    'Usuario creado correctamente',
                id:
                    resultado.insertId
            });

        }
    );

};


// =====================================================
// LOGIN
// =====================================================

exports.login = (
    req,
    res
) => {

    const {
        correo,
        password
    } = req.body;

    if (
        !correo ||
        !password
    ) {

        return res.status(400).json({
            mensaje:
                'Correo y contraseña son obligatorios'
        });

    }

    Usuario.buscarPorCorreo(
        correo,
        (error, datos) => {

            if (error) {

                console.error(
                    'Error en login:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al iniciar sesión',
                    error:
                        error.message
                });

            }

            if (
                datos.length === 0
            ) {

                return res.status(401).json({
                    mensaje:
                        'Correo no encontrado'
                });

            }

            const usuario = datos[0];

            if (
                usuario.password !==
                password
            ) {

                return res.status(401).json({
                    mensaje:
                        'Contraseña incorrecta'
                });

            }
            if (
    usuario.estado === 'bloqueado' ||
    usuario.estado === 'inactivo'
) {
    return res.status(403).json({
        mensaje:
            'La cuenta está bloqueada o inactiva'
    });
}

if (Number(usuario.activo) !== 1) {
    return res.status(403).json({
        mensaje:
            'La cuenta todavía no está activa'
    });
}

            const usuarioSeguro = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol || 'usuario',
    telefono: usuario.telefono || '',
    activo: Number(usuario.activo),
    ubicacion: usuario.ubicacion || '',
    imagen_perfil: usuario.imagen_perfil || '',
    estado: usuario.estado || 'activo'
};

            res.json({
                mensaje:
                    'Login correcto',
                usuario:
                    usuarioSeguro
            });

        }
    );

};


// =====================================================
// OBTENER PERFIL
// =====================================================

exports.obtenerPerfil = (
    req,
    res
) => {

    const usuarioId =
        req.params.id;

    Usuario.obtenerPerfilPorId(
        usuarioId,
        (error, datos) => {

            if (error) {

                console.error(
                    'Error al obtener perfil:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al obtener perfil',
                    error:
                        error.message
                });

            }

            if (
                datos.length === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Usuario no encontrado'
                });

            }

            res.json(
                datos[0]
            );

        }
    );

};


// =====================================================
// ACTUALIZAR PERFIL
// =====================================================

exports.actualizarPerfil = (
    req,
    res
) => {

    const usuarioId =
        req.params.id;

    const {
        nombre,
        correo,
        telefono,
        ubicacion,
        imagen_perfil
    } = req.body;

    if (
        !nombre ||
        !correo
    ) {

        return res.status(400).json({
            mensaje:
                'El nombre y el correo son obligatorios'
        });

    }

    const datos = {
        nombre,
        correo,
        telefono:
            telefono || '',
        ubicacion:
            ubicacion || '',
        imagen_perfil:
            imagen_perfil || ''
    };

    Usuario.actualizarPerfil(
        usuarioId,
        datos,
        (
            error,
            resultado
        ) => {

            if (error) {

                console.error(
                    'Error al actualizar perfil:',
                    error
                );

                if (
                    error.code ===
                    'ER_DUP_ENTRY'
                ) {

                    return res.status(409).json({
                        mensaje:
                            'El correo ya está registrado por otro usuario'
                    });

                }

                return res.status(500).json({
                    mensaje:
                        'Error al actualizar perfil',
                    error:
                        error.message
                });

            }

            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Usuario no encontrado'
                });

            }

            res.status(200).json({
                mensaje:
                    'Perfil actualizado correctamente'
            });

        }
    );

};


// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================

exports.cambiarPassword = (
    req,
    res
) => {

    const usuarioId =
        req.params.id;

    const {
        passwordActual,
        passwordNueva
    } = req.body;

    if (
        !passwordActual ||
        !passwordNueva
    ) {

        return res.status(400).json({
            mensaje:
                'La contraseña actual y la nueva son obligatorias'
        });

    }

    if (
        passwordNueva.length < 6
    ) {

        return res.status(400).json({
            mensaje:
                'La nueva contraseña debe tener al menos 6 caracteres'
        });

    }

    Usuario.obtenerUsuarioPorId(
        usuarioId,
        (
            error,
            datos
        ) => {

            if (error) {

                console.error(
                    'Error al consultar usuario:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al consultar usuario',
                    error:
                        error.message
                });

            }

            if (
                datos.length === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Usuario no encontrado'
                });

            }

            const usuario =
                datos[0];

            if (
                usuario.password !==
                passwordActual
            ) {

                return res.status(401).json({
                    mensaje:
                        'La contraseña actual es incorrecta'
                });

            }

            Usuario.cambiarPassword(
                usuarioId,
                passwordNueva,
                (
                    errorCambio,
                    resultado
                ) => {

                    if (errorCambio) {

                        console.error(
                            'Error al cambiar contraseña:',
                                                       errorCambio
                        );

                        return res.status(500).json({
                            mensaje:
                                'Error al cambiar la contraseña',
                            error:
                                errorCambio.message
                        });

                    }

                    if (
                        resultado.affectedRows === 0
                    ) {

                        return res.status(404).json({
                            mensaje:
                                'Usuario no encontrado'
                        });

                    }

                    res.status(200).json({
                        mensaje:
                            'Contraseña actualizada correctamente'
                    });

                }
            );

        }
    );

};