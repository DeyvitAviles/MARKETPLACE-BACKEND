const crypto = require('crypto');

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function signToken(payload, expiresInSeconds = 60 * 60 * 12) {
  const secret = process.env.JWT_SECRET || 'cambia-esta-clave-en-produccion';
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'cambia-esta-clave-en-produccion';
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Token inválido');
  const [header, body, signature] = parts;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Firma inválida');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expirado');
  return payload;
}

module.exports = { signToken, verifyToken };
