const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.error('FATAL: ADMIN_SECRET environment variable is not set.');
    process.exit(1);
  }
  return secret;
}

function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '30m' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch (e) {
    return null;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

module.exports = { signToken, verifyToken, ensureDir };
