const conexion = require('../config/database');

const Usuario = {
  obtenerTodos(resultado) {
    conexion.query(`
      SELECT id, nombre, correo, rol, telefono, activo, ubicacion, imagen_perfil, estado
      FROM usuarios
      ORDER BY id DESC
    `, resultado);
  },

  crear(usuario, resultado) {
    conexion.query(`
      INSERT INTO usuarios
      (nombre, correo, password, telefono, ubicacion, imagen_perfil, rol, activo, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      usuario.nombre,
      usuario.correo,
      usuario.password,
      usuario.telefono || '',
      usuario.ubicacion || '',
      usuario.imagen_perfil || '',
      usuario.rol || 'usuario',
      usuario.activo === undefined ? 1 : Number(usuario.activo),
      usuario.estado || 'activo',
    ], resultado);
  },

  buscarPorCorreo(correo, resultado) {
    conexion.query('SELECT * FROM usuarios WHERE correo = ? LIMIT 1', [correo], resultado);
  },

  obtenerUsuarioPorId(usuarioId, resultado) {
    conexion.query('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [usuarioId], resultado);
  },

  obtenerPerfilPorId(usuarioId, resultado) {
    conexion.query(`
      SELECT u.id, u.nombre, u.correo,
        COALESCE(u.telefono, '') AS telefono,
        COALESCE(u.ubicacion, '') AS ubicacion,
        COALESCE(u.imagen_perfil, '') AS imagen_perfil,
        u.rol, u.activo, u.estado,
        (SELECT COUNT(*) FROM productos p WHERE p.usuario_id = u.id) AS cantidad_productos,
        (SELECT COUNT(*) FROM favoritos f WHERE f.usuario_id = u.id) AS cantidad_favoritos
      FROM usuarios u WHERE u.id = ?
    `, [usuarioId], resultado);
  },

  actualizarPerfil(usuarioId, datos, resultado) {
    conexion.query(`
      UPDATE usuarios SET nombre = ?, correo = ?, telefono = ?, ubicacion = ?, imagen_perfil = ?
      WHERE id = ?
    `, [datos.nombre, datos.correo, datos.telefono || '', datos.ubicacion || '', datos.imagen_perfil || '', usuarioId], resultado);
  },

  cambiarPassword(usuarioId, nuevaPassword, resultado) {
    conexion.query('UPDATE usuarios SET password = ? WHERE id = ?', [nuevaPassword, usuarioId], resultado);
  },

  actualizarAdministrativo(usuarioId, datos, resultado) {
    conexion.query(`
      UPDATE usuarios SET nombre = ?, correo = ?, telefono = ?, ubicacion = ?, imagen_perfil = ?,
        rol = ?, activo = ?, estado = ?
      WHERE id = ?
    `, [
      datos.nombre,
      datos.correo,
      datos.telefono || '',
      datos.ubicacion || '',
      datos.imagen_perfil || '',
      datos.rol,
      Number(datos.activo),
      datos.estado,
      usuarioId,
    ], resultado);
  },

  contarSuperadministradores(resultado) {
    conexion.query(`
      SELECT COUNT(*) AS cantidad FROM usuarios
      WHERE rol = 'superadministrador' AND activo = 1 AND estado = 'activo'
    `, resultado);
  },

  eliminarLogicamente(usuarioId, resultado) {
    conexion.query(`UPDATE usuarios SET activo = 0, estado = 'eliminado' WHERE id = ?`, [usuarioId], resultado);
  },
};

module.exports = Usuario;
