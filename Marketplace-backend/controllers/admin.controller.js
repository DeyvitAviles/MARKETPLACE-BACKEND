const db = require('../config/database');

exports.resumen = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM usuarios) AS usuarios,
      (SELECT COUNT(*) FROM usuarios WHERE activo = 1 AND estado = 'activo') AS usuarios_activos,
      (SELECT COUNT(*) FROM productos) AS productos,
      (SELECT COUNT(*) FROM categorias) AS categorias,
      (SELECT COUNT(*) FROM conversaciones) AS conversaciones,
      (SELECT COUNT(*) FROM mensajes) AS mensajes
  `;
  db.query(sql, (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'No se pudo cargar el resumen' });
    res.json(datos[0]);
  });
};

exports.listarConversaciones = (req, res) => {
  db.query(`
    SELECT c.id, c.fecha_creacion, c.producto_id, p.nombre AS producto,
      c.usuario1_id, u1.nombre AS usuario1,
      c.usuario2_id, u2.nombre AS usuario2,
      (SELECT COUNT(*) FROM mensajes m WHERE m.conversacion_id = c.id) AS mensajes,
      (SELECT MAX(m.fecha) FROM mensajes m WHERE m.conversacion_id = c.id) AS ultima_actividad
    FROM conversaciones c
    INNER JOIN productos p ON p.id = c.producto_id
    INNER JOIN usuarios u1 ON u1.id = c.usuario1_id
    INNER JOIN usuarios u2 ON u2.id = c.usuario2_id
    ORDER BY COALESCE(ultima_actividad, c.fecha_creacion) DESC
  `, (error, datos) => {
    if (error) return res.status(500).json({ mensaje: 'No se pudieron cargar las conversaciones' });
    res.json(datos);
  });
};

exports.detalleConversacion = (req, res) => {
  const id = Number(req.params.id);
  db.query(`
    SELECT c.*, p.nombre AS producto, u1.nombre AS usuario1, u2.nombre AS usuario2
    FROM conversaciones c
    INNER JOIN productos p ON p.id = c.producto_id
    INNER JOIN usuarios u1 ON u1.id = c.usuario1_id
    INNER JOIN usuarios u2 ON u2.id = c.usuario2_id
    WHERE c.id = ?
  `, [id], (error, conversaciones) => {
    if (error) return res.status(500).json({ mensaje: 'Error al cargar la conversación' });
    if (!conversaciones.length) return res.status(404).json({ mensaje: 'Conversación no encontrada' });
    db.query(`
      SELECT m.*, u.nombre AS emisor FROM mensajes m
      INNER JOIN usuarios u ON u.id = m.emisor_id
      WHERE m.conversacion_id = ? ORDER BY m.fecha ASC
    `, [id], (err, mensajes) => {
      if (err) return res.status(500).json({ mensaje: 'Error al cargar mensajes' });
      res.json({ conversacion: conversaciones[0], mensajes });
    });
  });
};

exports.eliminarConversacion = (req, res) => {
  const id = Number(req.params.id);
  db.getConnection((error, connection) => {
    if (error) return res.status(500).json({ mensaje: 'Error de base de datos' });
    connection.beginTransaction((err) => {
      if (err) { connection.release(); return res.status(500).json({ mensaje: 'No se pudo iniciar la operación' }); }
      connection.query('DELETE FROM mensajes WHERE conversacion_id = ?', [id], (errMensajes) => {
        if (errMensajes) return connection.rollback(() => { connection.release(); res.status(500).json({ mensaje: 'No se pudieron eliminar los mensajes' }); });
        connection.query('DELETE FROM conversaciones WHERE id = ?', [id], (errConversacion, resultado) => {
          if (errConversacion) return connection.rollback(() => { connection.release(); res.status(500).json({ mensaje: 'No se pudo eliminar la conversación' }); });
          connection.commit((errCommit) => {
            if (errCommit) return connection.rollback(() => { connection.release(); res.status(500).json({ mensaje: 'No se pudo confirmar la eliminación' }); });
            connection.release();
            if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'Conversación no encontrada' });
            res.json({ mensaje: 'Conversación eliminada correctamente' });
          });
        });
      });
    });
  });
};
