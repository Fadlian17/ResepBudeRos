const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

function signToken(payload) {
  const secret = process.env.ADMIN_SECRET || 'devsecret';
  return jwt.sign(payload, secret, { expiresIn: '30m' });
}

function verifyToken(token) {
  try {
    const secret = process.env.ADMIN_SECRET || 'devsecret';
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

module.exports = { signToken, verifyToken, ensureDir };
