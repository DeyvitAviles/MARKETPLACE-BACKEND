const crypto = require('crypto');
const https = require('https');

const URL_CERTIFICADOS =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let certificadosCache = null;
let certificadosExpiranEn = 0;

function base64UrlABuffer(valor) {
  const normalizado = valor.replace(/-/g, '+').replace(/_/g, '/');
  const relleno = '='.repeat((4 - (normalizado.length % 4)) % 4);
  return Buffer.from(normalizado + relleno, 'base64');
}

function decodificarJsonBase64Url(valor) {
  return JSON.parse(base64UrlABuffer(valor).toString('utf8'));
}

function obtenerCertificados() {
  if (certificadosCache && Date.now() < certificadosExpiranEn) {
    return Promise.resolve(certificadosCache);
  }

  return new Promise((resolve, reject) => {
    https.get(URL_CERTIFICADOS, (respuesta) => {
      let contenido = '';
      respuesta.setEncoding('utf8');
      respuesta.on('data', (parte) => {
        contenido += parte;
      });
      respuesta.on('end', () => {
        if (respuesta.statusCode < 200 || respuesta.statusCode >= 300) {
          return reject(new Error('No se pudieron obtener los certificados de Firebase'));
        }

        try {
          certificadosCache = JSON.parse(contenido);
          const cacheControl = respuesta.headers['cache-control'] || '';
          const coincidencia = cacheControl.match(/max-age=(\d+)/i);
          const segundos = Number(coincidencia?.[1] || 3600);
          certificadosExpiranEn = Date.now() + Math.max(60, segundos) * 1000;
          resolve(certificadosCache);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function verificarFirebaseIdToken(token) {
  const projectId = String(process.env.FIREBASE_PROJECT_ID || '').trim();
  if (!projectId) {
    const error = new Error('FIREBASE_PROJECT_ID no está configurado');
    error.code = 'firebase/no-configurado';
    throw error;
  }

  const partes = String(token || '').split('.');
  if (partes.length !== 3) {
    const error = new Error('Token de Firebase mal formado');
    error.code = 'firebase/token-invalido';
    throw error;
  }

  const [cabeceraTexto, payloadTexto, firmaTexto] = partes;
  const cabecera = decodificarJsonBase64Url(cabeceraTexto);
  const payload = decodificarJsonBase64Url(payloadTexto);

  if (cabecera.alg !== 'RS256' || !cabecera.kid) {
    const error = new Error('Algoritmo o identificador de certificado no válido');
    error.code = 'firebase/token-invalido';
    throw error;
  }

  const certificados = await obtenerCertificados();
  const certificado = certificados[cabecera.kid];
  if (!certificado) {
    certificadosCache = null;
    certificadosExpiranEn = 0;
    const nuevosCertificados = await obtenerCertificados();
    if (!nuevosCertificados[cabecera.kid]) {
      const error = new Error('No se encontró el certificado del token');
      error.code = 'firebase/token-invalido';
      throw error;
    }
  }

  const certificadoFinal =
    (certificadosCache || certificados)[cabecera.kid];
  const firmaValida = crypto.verify(
    'RSA-SHA256',
    Buffer.from(`${cabeceraTexto}.${payloadTexto}`),
    certificadoFinal,
    base64UrlABuffer(firmaTexto),
  );

  if (!firmaValida) {
    const error = new Error('La firma del token no es válida');
    error.code = 'firebase/token-invalido';
    throw error;
  }

  const ahora = Math.floor(Date.now() / 1000);
  if (payload.aud !== projectId) {
    const error = new Error('El token pertenece a otro proyecto de Firebase');
    error.code = 'firebase/token-invalido';
    throw error;
  }
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    const error = new Error('El emisor del token no es válido');
    error.code = 'firebase/token-invalido';
    throw error;
  }
  if (!payload.sub || typeof payload.sub !== 'string') {
    const error = new Error('El token no contiene un usuario válido');
    error.code = 'firebase/token-invalido';
    throw error;
  }
  if (!Number(payload.exp) || Number(payload.exp) <= ahora) {
    const error = new Error('El token de Firebase venció');
    error.code = 'firebase/token-expirado';
    throw error;
  }
  if (!Number(payload.iat) || Number(payload.iat) > ahora + 300) {
    const error = new Error('La fecha del token no es válida');
    error.code = 'firebase/token-invalido';
    throw error;
  }

  return payload;
}

module.exports = { verificarFirebaseIdToken };
