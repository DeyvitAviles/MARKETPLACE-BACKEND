const Producto = require('../models/Producto');

function validarProducto(body) {
  const nombre = String(body.nombre || '').trim();
  const descripcion = String(body.descripcion || '').trim();
  const ubicacion = String(body.ubicacion || '').trim();
  const precio = Number(String(body.precio ?? '').replace(',', '.'));
  const stock = Number(body.stock);
  const categoria_id = Number(body.categoria_id);
  if (!nombre || !descripcion || !ubicacion || !Number.isFinite(precio) || precio <= 0 || !Number.isFinite(stock) || stock < 0 || !Number.isInteger(categoria_id) || categoria_id <= 0) {
    return { error: 'Completa correctamente todos los campos del producto' };
  }
  return { nombre, descripcion, ubicacion, precio, stock, categoria_id };
}

function manejarError(res, error, mensaje) {
  console.error(mensaje, error);
  if (error?.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ mensaje: 'No se puede eliminar porque existen datos relacionados' });
  if (error?.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({ mensaje: 'El usuario o la categoría no existe' });
  return res.status(500).json({ mensaje });
}

exports.listarProductos = (req, res) => {
  Producto.obtenerTodos((error, datos) => {
    if (error) return manejarError(res, error, 'No se pudieron cargar los productos');
    res.json(datos);
  });
};

exports.obtenerProducto = (req, res) => {
  Producto.obtenerPorId(Number(req.params.id), (error, datos) => {
    if (error) return manejarError(res, error, 'No se pudo cargar el producto');
    if (!datos.length) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(datos[0]);
  });
};

exports.crearProducto = (req, res) => {
  const validado = validarProducto(req.body);
  if (validado.error) return res.status(400).json({ mensaje: validado.error });
  const usuario_id = Number(req.usuario?.id || req.body.usuario_id);
  if (!Number.isInteger(usuario_id) || usuario_id <= 0) return res.status(400).json({ mensaje: 'El usuario no es válido' });
  Producto.crear({
    ...validado,
    usuario_id,
    imagen: req.file ? `/uploads/${req.file.filename}` : '',
  }, (error, resultado) => {
    if (error) return manejarError(res, error, 'No se pudo crear el producto');
    res.status(201).json({ mensaje: 'Producto creado correctamente', id: resultado.insertId });
  });
};

exports.productosPorUsuario = (req, res) => {
  const usuarioId = Number(req.params.usuario_id);
  Producto.obtenerPorUsuario(usuarioId, (error, datos) => {
    if (error) return manejarError(res, error, 'No se pudieron cargar los productos del usuario');
    res.json(datos);
  });
};

exports.actualizarProducto = (req, res) => {
  const validado = validarProducto(req.body);
  if (validado.error) return res.status(400).json({ mensaje: validado.error });
  const productoId = Number(req.params.id);
  const usuario_id = Number(req.usuario?.id || req.body.usuario_id);
  if (!Number.isInteger(productoId) || !Number.isInteger(usuario_id)) return res.status(400).json({ mensaje: 'Datos no válidos' });
  Producto.actualizar(productoId, {
    ...validado,
    usuario_id,
    imagen: req.file ? `/uploads/${req.file.filename}` : null,
  }, (error, resultado) => {
    if (error) return manejarError(res, error, 'No se pudo actualizar el producto');
    if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'El producto no existe o no pertenece al usuario' });
    res.json({ mensaje: 'Producto actualizado correctamente', id: productoId });
  });
};

exports.eliminarProducto = (req, res) => {
  const productoId = Number(req.params.id);
  const usuarioId = Number(req.usuario?.id || req.body?.usuario_id);
  if (!Number.isInteger(productoId) || !Number.isInteger(usuarioId)) return res.status(400).json({ mensaje: 'Datos no válidos' });
  Producto.eliminar(productoId, usuarioId, (error, resultado) => {
    if (error) return manejarError(res, error, 'No se pudo eliminar el producto');
    if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'El producto no existe o no pertenece al usuario' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  });
};

exports.actualizarProductoAdmin = (req, res) => {
  const validado = validarProducto(req.body);
  if (validado.error) return res.status(400).json({ mensaje: validado.error });
  const productoId = Number(req.params.id);
  Producto.actualizarAdmin(productoId, {
    ...validado,
    imagen: req.file ? `/uploads/${req.file.filename}` : null,
  }, (error, resultado) => {
    if (error) return manejarError(res, error, 'No se pudo actualizar el producto');
    if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado por administración' });
  });
};

exports.eliminarProductoAdmin = (req, res) => {
  Producto.eliminarAdmin(Number(req.params.id), (error, resultado) => {
    if (error) return manejarError(res, error, 'No se pudo eliminar el producto');
    if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado por administración' });
  });
};
