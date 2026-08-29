require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

const { db, init } = require('./db.cjs');
const { signToken, verifyToken, ensureDir } = require('./utils.cjs');

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:4000';

if (!process.env.ADMIN_CODE) {
  console.error('FATAL: ADMIN_CODE environment variable is not set.');
  process.exit(1);
}
const ADMIN_CODE = process.env.ADMIN_CODE;

init();

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());

// Rate limiter (simple in-memory)
const rateLimitStore = new Map();
function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const record = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }
    record.count++;
    rateLimitStore.set(key, record);
    if (record.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore) {
    if (now > record.resetAt) rateLimitStore.delete(key);
  }
}, 10 * 60 * 1000);

// static public files — only serve public/ directory, not the entire project
app.use('/', express.static(path.join(__dirname, '..', 'public')));

// ensure upload dirs
const scansDir = path.join(__dirname, '..', 'public', 'scans');
const scansThumbs = path.join(scansDir, 'thumbs');
ensureDir(scansDir);
ensureDir(scansThumbs);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, scansDir);
  },
  filename: function (req, file, cb) {
    const id = uuidv4();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${id}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.replace(/^Bearer\s+/i, '') || null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  req.admin = payload;
  next();
}

// admin verify endpoint (rate limited: 5 attempts per 15 minutes)
app.post('/admin/verify', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'code required' });
  if (code !== ADMIN_CODE) return res.status(403).json({ error: 'invalid code' });
  const token = signToken({ role: 'admin' });
  res.json({ token });
});

// Health check
app.get('/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// list recipes
app.get('/api/recipes', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const rows = db.prepare('SELECT * FROM recipes ORDER BY createdAt DESC').all();
  const data = rows.map(r => ({ ...r, metadata: r.metadata ? JSON.parse(r.metadata) : null }));
  if (q) {
    const filtered = data.filter(r => (r.title || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q) || (r.category || '').toLowerCase().includes(q));
    return res.json(filtered);
  }
  res.json(data);
});

app.get('/api/recipes/:id', (req, res) => {
  const id = req.params.id;
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'not found' });
  row.metadata = row.metadata ? JSON.parse(row.metadata) : null;
  res.json(row);
});

// create recipe
app.post('/api/recipes', requireAuth, upload.single('scan'), async (req, res) => {
  try {
    const { title, description = '', category = 'Uncategorized', md = '', metadata = '{}' } = req.body;
    if (!title || title.trim().length < 3) return res.status(400).json({ error: 'title required' });
    const id = slugify(title, { lower: true, strict: true }) || uuidv4();
    const exists = db.prepare('SELECT 1 FROM recipes WHERE id = ?').get(id);
    if (exists) return res.status(409).json({ error: 'id already exists (title produces duplicate slug)' });

    let scanPath = null;
    let scanThumb = null;
    if (req.file) {
      scanPath = path.join('public', 'scans', req.file.filename).replace(/\\/g, '/');
      const ext = path.extname(req.file.filename).toLowerCase();
      // generate thumb for images
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const thumbPath = path.join(scansThumbs, `${path.parse(req.file.filename).name}.webp`);
        await sharp(req.file.path).resize({ width: 1200 }).webp({ quality: 80 }).toFile(thumbPath);
        scanThumb = path.join('public', 'scans', 'thumbs', `${path.parse(req.file.filename).name}.webp`).replace(/\\/g, '/');
      }
    }

    const now = new Date().toISOString();
    db.prepare(`INSERT INTO recipes (id, title, description, category, md, scanPath, scanThumb, metadata, ocrText, createdAt, updatedAt)
      VALUES (@id,@title,@description,@category,@md,@scanPath,@scanThumb,@metadata,@ocrText,@createdAt,@updatedAt)
    `).run({
      id, title, description, category, md, scanPath, scanThumb, metadata: metadata || '{}', ocrText: null, createdAt: now, updatedAt: now
    });

    const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    row.metadata = row.metadata ? JSON.parse(row.metadata) : null;
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// update
app.put('/api/recipes/:id', requireAuth, upload.single('scan'), async (req, res) => {
  try {
    const id = req.params.id;
    const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'not found' });
    const { title = row.title, description = row.description, category = row.category, md = row.md, metadata = row.metadata } = req.body;

    let scanPath = row.scanPath;
    let scanThumb = row.scanThumb;
    if (req.file) {
      // delete old files if present
      try { if (row.scanPath) fs.unlinkSync(path.join(__dirname, '..', row.scanPath)); } catch(e) {}
      scanPath = path.join('public', 'scans', req.file.filename).replace(/\\/g, '/');
      const ext = path.extname(req.file.filename).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const thumbPath = path.join(scansThumbs, `${path.parse(req.file.filename).name}.webp`);
        await sharp(req.file.path).resize({ width: 1200 }).webp({ quality: 80 }).toFile(thumbPath);
        scanThumb = path.join('public', 'scans', 'thumbs', `${path.parse(req.file.filename).name}.webp`).replace(/\\/g, '/');
      }
    }

    const now = new Date().toISOString();
    db.prepare(`UPDATE recipes SET title=@title, description=@description, category=@category, md=@md, scanPath=@scanPath, scanThumb=@scanThumb, metadata=@metadata, updatedAt=@updatedAt WHERE id=@id`).run({
      id, title, description, category, md, scanPath, scanThumb, metadata: metadata || '{}', updatedAt: now
    });

    const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    updated.metadata = updated.metadata ? JSON.parse(updated.metadata) : null;
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// delete
app.delete('/api/recipes/:id', requireAuth, (req, res) => {
  try {
    const id = req.params.id;
    const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'not found' });
    // delete files
    try { if (row.scanPath) fs.unlinkSync(path.join(__dirname, '..', row.scanPath)); } catch(e) {}
    try { if (row.scanThumb) fs.unlinkSync(path.join(__dirname, '..', row.scanThumb)); } catch(e) {}
    db.prepare('DELETE FROM recipes WHERE id = ?').run(id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
