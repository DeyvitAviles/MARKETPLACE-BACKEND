const conexion = require('../config/database');

const SELECT_BASE = `
  SELECT p.*, u.nombre AS vendedor, u.telefono,
    c.nombre AS categoria_nombre,
    (SELECT COUNT(*) FROM favoritos f WHERE f.producto_id = p.id) AS cantidad_favoritos
  FROM productos p
  INNER JOIN usuarios u ON p.usuario_id = u.id
  LEFT JOIN categorias c ON p.categoria_id = c.id
`;

const Producto = {
  obtenerTodos(resultado) {
    conexion.query(`${SELECT_BASE} ORDER BY p.fecha_publicacion DESC`, resultado);
  },

  obtenerPorId(id, resultado) {
    conexion.query(`${SELECT_BASE} WHERE p.id = ? LIMIT 1`, [id], resultado);
  },

  crear(producto, resultado) {
    conexion.query(`
      INSERT INTO productos
      (nombre, descripcion, ubicacion, precio, stock, categoria_id, imagen, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [producto.nombre, producto.descripcion, producto.ubicacion, producto.precio, producto.stock, producto.categoria_id, producto.imagen, producto.usuario_id], resultado);
  },

  obtenerPorUsuario(usuarioId, resultado) {
    conexion.query(`${SELECT_BASE} WHERE p.usuario_id = ? ORDER BY p.fecha_publicacion DESC`, [usuarioId], resultado);
  },

  actualizar(id, producto, resultado) {
    const imagenSql = producto.imagen ? ', imagen = ?' : '';
    const valores = [producto.nombre, producto.descripcion, producto.ubicacion, producto.precio, producto.stock, producto.categoria_id];
    if (producto.imagen) valores.push(producto.imagen);
    valores.push(id, producto.usuario_id);
    conexion.query(`
      UPDATE productos SET nombre = ?, descripcion = ?, ubicacion = ?, precio = ?, stock = ?, categoria_id = ?${imagenSql}
      WHERE id = ? AND usuario_id = ?
    `, valores, resultado);
  },

  eliminar(id, usuarioId, resultado) {
    conexion.query('DELETE FROM productos WHERE id = ? AND usuario_id = ?', [id, usuarioId], resultado);
  },

  actualizarAdmin(id, producto, resultado) {
    const imagenSql = producto.imagen ? ', imagen = ?' : '';
    const valores = [producto.nombre, producto.descripcion, producto.ubicacion, producto.precio, producto.stock, producto.categoria_id];
    if (producto.imagen) valores.push(producto.imagen);
    valores.push(id);
    conexion.query(`
      UPDATE productos SET nombre = ?, descripcion = ?, ubicacion = ?, precio = ?, stock = ?, categoria_id = ?${imagenSql}
      WHERE id = ?
    `, valores, resultado);
  },

  eliminarAdmin(id, resultado) {
    conexion.query('DELETE FROM productos WHERE id = ?', [id], resultado);
  },
};

module.exports = Producto;
