const { responderConsulta } = require('../services/ia.service');

const ventanaPorUsuario = new Map();
const UNA_HORA = 60 * 60 * 1000;

function puedeConsultar(usuarioId) {
  const limite = Math.max(1, Number(process.env.IA_MAX_CONSULTAS_HORA || 20));
  const ahora = Date.now();
  const registro = ventanaPorUsuario.get(usuarioId);

  if (!registro || ahora - registro.inicio >= UNA_HORA) {
    ventanaPorUsuario.set(usuarioId, { inicio: ahora, cantidad: 1 });
    return { permitido: true, restantes: limite - 1 };
  }

  if (registro.cantidad >= limite) {
    return { permitido: false, reintentarEn: Math.ceil((UNA_HORA - (ahora - registro.inicio)) / 60000) };
  }

  registro.cantidad += 1;
  return { permitido: true, restantes: limite - registro.cantidad };
}

function normalizarHistorial(historial) {
  if (!Array.isArray(historial)) return [];
  return historial
    .slice(-8)
    .map((item) => ({
      rol: item?.rol === 'usuario' ? 'usuario' : 'ia',
      texto: String(item?.texto || '').trim().slice(0, 500),
    }))
    .filter((item) => item.texto);
}

exports.chat = async (req, res) => {
  const mensaje = String(req.body?.mensaje || '').trim();
  if (!mensaje) return res.status(400).json({ mensaje: 'Escribe una consulta para el asistente' });
  if (mensaje.length > 500) return res.status(400).json({ mensaje: 'La consulta no puede superar los 500 caracteres' });

  const control = puedeConsultar(Number(req.usuario.id));
  if (!control.permitido) {
    return res.status(429).json({ mensaje: `Alcanzaste el límite temporal. Intenta nuevamente en ${control.reintentarEn} minutos.` });
  }

  try {
    const resultado = await responderConsulta({
      mensaje,
      historial: normalizarHistorial(req.body?.historial),
    });

    return res.json({
      ok: true,
      respuesta: resultado.respuesta,
      productos: resultado.productos,
      consultas_restantes: Math.max(0, control.restantes),
    });
  } catch (error) {
    console.error('Error del asistente IA:', error.message);

    if (error.codigo === 'IA_SIN_CONFIGURAR') {
      return res.status(503).json({ mensaje: 'El asistente todavía no tiene configurada la clave de OpenAI' });
    }
    if (error.status === 401) {
      return res.status(503).json({ mensaje: 'La clave de OpenAI no es válida o fue desactivada' });
    }
    if (error.status === 429) {
      return res.status(429).json({ mensaje: 'La cuenta de OpenAI no tiene cuota disponible o alcanzó su límite' });
    }
    if (error.status === 400) {
      return res.status(400).json({ mensaje: 'OpenAI no pudo procesar esta consulta. Prueba con otra pregunta.' });
    }

    return res.status(500).json({ mensaje: 'El asistente no está disponible temporalmente' });
  }
};
