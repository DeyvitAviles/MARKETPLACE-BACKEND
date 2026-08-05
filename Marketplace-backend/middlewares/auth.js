const Usuario = require('../models/Usuario');
const { verifyToken } = require('../utils/token');

function obtenerBearer(req) {
  const authorization = req.headers.authorization || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
}

function cargarUsuario(req, res, next, obligatorio) {
  const token = obtenerBearer(req);
  if (!token) {
    if (obligatorio) return res.status(401).json({ mensaje: 'Debes iniciar sesión' });
    return next();
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (error) {
    if (obligatorio) return res.status(401).json({ mensaje: error.message });
    return next();
  }

  Usuario.obtenerUsuarioPorId(payload.id, (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'Error al validar la sesión' });
    if (!datos.length) return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    const usuario = datos[0];
    if (Number(usuario.activo) !== 1 || usuario.estado !== 'activo') {
      return res.status(403).json({ mensaje: 'La cuenta no está activa' });
    }
    req.usuario = usuario;
    next();
  });
}

function autenticar(req, res, next) {
  return cargarUsuario(req, res, next, true);
}

function autenticacionOpcional(req, res, next) {
  return cargarUsuario(req, res, next, false);
}

function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ mensaje: 'Debes iniciar sesión' });
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
}

module.exports = { autenticar, autenticacionOpcional, permitirRoles };
