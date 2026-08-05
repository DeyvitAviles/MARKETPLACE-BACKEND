const conexion = require('../config/database');

const Favorito = {
  agregar(usuarioId, productoId, resultado) {
    conexion.query('INSERT INTO favoritos (usuario_id, producto_id) VALUES (?, ?)', [usuarioId, productoId], resultado);
  },
  obtenerPorUsuario(usuarioId, resultado) {
    conexion.query(`
      SELECT p.*, u.nombre AS vendedor, u.telefono, c.nombre AS categoria_nombre,
        1 AS favorito,
        (SELECT COUNT(*) FROM favoritos fx WHERE fx.producto_id = p.id) AS cantidad_favoritos
      FROM favoritos f
      INNER JOIN productos p ON f.producto_id = p.id
      INNER JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE f.usuario_id = ? ORDER BY f.id DESC
    `, [usuarioId], resultado);
  },
  verificar(usuarioId, productoId, resultado) {
    conexion.query('SELECT id FROM favoritos WHERE usuario_id = ? AND producto_id = ? LIMIT 1', [usuarioId, productoId], resultado);
  },
  eliminar(usuarioId, productoId, resultado) {
    conexion.query('DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?', [usuarioId, productoId], resultado);
  },
  contarPorProducto(productoId, resultado) {
    conexion.query('SELECT COUNT(*) AS cantidad FROM favoritos WHERE producto_id = ?', [productoId], resultado);
  },
};
module.exports = Favorito;
