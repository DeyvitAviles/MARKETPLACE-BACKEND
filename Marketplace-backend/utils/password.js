const crypto = require('crypto');

const PREFIX = 'scrypt';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${PREFIX}$${salt}$${hash}`;
}

function verifyPassword(password, storedPassword) {
  const stored = String(storedPassword || '');
  if (!stored.startsWith(`${PREFIX}$`)) {
    const actual = Buffer.from(String(password));
    const expected = Buffer.from(stored);
    return {
      valid: actual.length === expected.length && crypto.timingSafeEqual(actual, expected),
      needsUpgrade: true,
    };
  }

  const [, salt, expectedHex] = stored.split('$');
  if (!salt || !expectedHex) return { valid: false, needsUpgrade: false };
  const actual = crypto.scryptSync(String(password), salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return {
    valid: expected.length === actual.length && crypto.timingSafeEqual(actual, expected),
    needsUpgrade: false,
  };
}

module.exports = { hashPassword, verifyPassword };
