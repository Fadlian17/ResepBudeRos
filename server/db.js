const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data', 'db.sqlite');
const db = new Database(dbPath);

function init() {
  db.prepare(`CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    category TEXT,
    md TEXT,
    scanPath TEXT,
    scanThumb TEXT,
    metadata TEXT,
    ocrText TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )`).run();
}

module.exports = { db, init };
