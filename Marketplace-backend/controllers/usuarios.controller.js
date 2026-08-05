const Usuario = require('../models/Usuario');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/token');

function usuarioSeguro(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol || 'usuario',
    telefono: usuario.telefono || '',
    activo: Number(usuario.activo),
    ubicacion: usuario.ubicacion || '',
    imagen_perfil: usuario.imagen_perfil || '',
    estado: usuario.estado || 'activo',
  };
}

exports.listarUsuarios = (req, res) => {
  Usuario.obtenerTodos((error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'Error al listar usuarios' });
    res.json(datos);
  });
};

exports.crearUsuario = (req, res) => {
  const { nombre, correo, password, telefono, ubicacion, imagen_perfil } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });
  }
  if (String(password).length < 6) return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  Usuario.crear({
    nombre: nombre.trim(),
    correo: correo.trim().toLowerCase(),
    password: hashPassword(password),
    telefono,
    ubicacion,
    imagen_perfil,
    rol: 'usuario',
    activo: 1,
    estado: 'activo',
  }, (error, resultado) => {
    if (error?.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    if (error) return res.status(500).json({ mensaje: 'Error al crear usuario' });
    res.status(200).json({ mensaje: 'Usuario creado correctamente', id: resultado.insertId });
  });
};

exports.crearUsuarioAdmin = (req, res) => {
  const { nombre, correo, password, telefono, ubicacion, imagen_perfil, rol = 'usuario', activo = 1, estado = 'activo' } = req.body;
  if (!nombre || !correo || !password) return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });
  const roles = ['usuario', 'administrador', 'superadministrador'];
  if (!roles.includes(rol)) return res.status(400).json({ mensaje: 'Rol no válido' });
  if (req.usuario.rol !== 'superadministrador' && rol !== 'usuario') {
    return res.status(403).json({ mensaje: 'Solo el superadministrador puede crear administradores' });
  }
  Usuario.crear({ nombre, correo: correo.toLowerCase(), password: hashPassword(password), telefono, ubicacion, imagen_perfil, rol, activo, estado }, (error, resultado) => {
    if (error?.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    if (error) return res.status(500).json({ mensaje: 'Error al crear usuario' });
    res.status(201).json({ mensaje: 'Usuario creado correctamente', id: resultado.insertId });
  });
};

exports.login = (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  Usuario.buscarPorCorreo(correo.trim().toLowerCase(), (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    if (!datos.length) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    const usuario = datos[0];
    const verificacion = verifyPassword(password, usuario.password);
    if (!verificacion.valid) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    if (usuario.estado !== 'activo' || Number(usuario.activo) !== 1) {
      return res.status(403).json({ mensaje: 'La cuenta está bloqueada o inactiva' });
    }
    if (verificacion.needsUpgrade) {
      Usuario.cambiarPassword(usuario.id, hashPassword(password), () => {});
    }
    const seguro = usuarioSeguro(usuario);
    const token = signToken({ id: seguro.id, rol: seguro.rol });
    res.json({ mensaje: 'Login correcto', usuario: seguro, token });
  });
};

exports.me = (req, res) => res.json({ usuario: usuarioSeguro(req.usuario) });

exports.obtenerPerfil = (req, res) => {
  Usuario.obtenerPerfilPorId(req.params.id, (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'Error al obtener perfil' });
    if (!datos.length) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(datos[0]);
  });
};

exports.actualizarPerfil = (req, res) => {
  const usuarioId = Number(req.params.id);
  if (req.usuario && req.usuario.id !== usuarioId && !['administrador', 'superadministrador'].includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'No puedes editar este perfil' });
  }
  const { nombre, correo, telefono, ubicacion, imagen_perfil } = req.body;
  if (!nombre || !correo) return res.status(400).json({ mensaje: 'El nombre y el correo son obligatorios' });
  Usuario.actualizarPerfil(usuarioId, { nombre, correo: correo.toLowerCase(), telefono, ubicacion, imagen_perfil }, (error, resultado) => {
    if (error?.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    if (error) return res.status(500).json({ mensaje: 'Error al actualizar perfil' });
    if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Perfil actualizado correctamente' });
  });
};

exports.cambiarPassword = (req, res) => {
  const usuarioId = Number(req.params.id);
  const { passwordActual, passwordNueva } = req.body;
  if (!passwordActual || !passwordNueva) return res.status(400).json({ mensaje: 'La contraseña actual y la nueva son obligatorias' });
  if (String(passwordNueva).length < 6) return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' });
  if (req.usuario && req.usuario.id !== usuarioId) return res.status(403).json({ mensaje: 'No puedes cambiar esta contraseña' });
  Usuario.obtenerUsuarioPorId(usuarioId, (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'Error al consultar usuario' });
    if (!datos.length) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (!verifyPassword(passwordActual, datos[0].password).valid) return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    Usuario.cambiarPassword(usuarioId, hashPassword(passwordNueva), (errorCambio) => {
      if (errorCambio) return res.status(500).json({ mensaje: 'Error al cambiar la contraseña' });
      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  });
};

exports.actualizarUsuarioAdmin = (req, res) => {
  const usuarioId = Number(req.params.id);
  Usuario.obtenerUsuarioPorId(usuarioId, (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'Error al consultar usuario' });
    if (!datos.length) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    const objetivo = datos[0];
    if (req.usuario.rol !== 'superadministrador' && objetivo.rol !== 'usuario') {
      return res.status(403).json({ mensaje: 'Solo el superadministrador puede modificar administradores' });
    }
    const rol = req.body.rol || objetivo.rol;
    if (!['usuario', 'administrador', 'superadministrador'].includes(rol)) return res.status(400).json({ mensaje: 'Rol no válido' });
    if (req.usuario.rol !== 'superadministrador' && rol !== 'usuario') return res.status(403).json({ mensaje: 'No puedes asignar ese rol' });
    const datosActualizados = {
      nombre: req.body.nombre ?? objetivo.nombre,
      correo: (req.body.correo ?? objetivo.correo).toLowerCase(),
      telefono: req.body.telefono ?? objetivo.telefono,
      ubicacion: req.body.ubicacion ?? objetivo.ubicacion,
      imagen_perfil: req.body.imagen_perfil ?? objetivo.imagen_perfil,
      rol,
      activo: req.body.activo === undefined ? objetivo.activo : Number(req.body.activo),
      estado: req.body.estado || objetivo.estado,
    };

    if (usuarioId === req.usuario.id && (Number(datosActualizados.activo) !== 1 || datosActualizados.estado !== 'activo')) {
      return res.status(400).json({ mensaje: 'No puedes desactivar tu propia sesión administrativa' });
    }
    const aplicarActualizacion = () => Usuario.actualizarAdministrativo(usuarioId, datosActualizados, (errorUpdate) => {
      if (errorUpdate?.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'El correo ya está registrado' });
      if (errorUpdate) return res.status(500).json({ mensaje: 'Error al actualizar usuario' });
      res.json({ mensaje: 'Usuario actualizado correctamente' });
    });

    const dejaDeSerSuperadmin = objetivo.rol === 'superadministrador' && (
      datosActualizados.rol !== 'superadministrador' ||
      Number(datosActualizados.activo) !== 1 ||
      datosActualizados.estado !== 'activo'
    );

    if (dejaDeSerSuperadmin) {
      return Usuario.contarSuperadministradores((errorConteo, conteo) => {
        if (errorConteo) return res.status(500).json({ mensaje: 'Error al validar superadministradores' });
        if (Number(conteo[0].cantidad) <= 1) {
          return res.status(409).json({ mensaje: 'Debe existir al menos un superadministrador activo' });
        }
        aplicarActualizacion();
      });
    }

    aplicarActualizacion();
  });
};

exports.eliminarUsuarioAdmin = (req, res) => {
  const usuarioId = Number(req.params.id);
  if (usuarioId === req.usuario.id) return res.status(400).json({ mensaje: 'No puedes eliminar tu propia cuenta' });
  Usuario.obtenerUsuarioPorId(usuarioId, (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'Error al consultar usuario' });
    if (!datos.length) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    const objetivo = datos[0];
    if (req.usuario.rol !== 'superadministrador' && objetivo.rol !== 'usuario') {
      return res.status(403).json({ mensaje: 'Solo el superadministrador puede eliminar administradores' });
    }
    const eliminar = () => Usuario.eliminarLogicamente(usuarioId, (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error al eliminar usuario' });
      res.json({ mensaje: 'Usuario desactivado correctamente' });
    });
    if (objetivo.rol === 'superadministrador') {
      return Usuario.contarSuperadministradores((err, conteo) => {
        if (err) return res.status(500).json({ mensaje: 'Error al validar superadministradores' });
        if (Number(conteo[0].cantidad) <= 1) return res.status(409).json({ mensaje: 'Debe existir al menos un superadministrador activo' });
        eliminar();
      });
    }
    eliminar();
  });
};
