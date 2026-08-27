# Analisis Proyek ResepBudeRos (Ibu's Digital Archive)

> Website arsip resep tulisan tangan Ibu — mengabadikan warisan kuliner keluarga dalam format digital.

---

## Ringkasan Arsitektur

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Vanilla JS + Tailwind CSS (CDN) + Marked.js |
| Backend | Express.js + better-sqlite3 + JWT |
| Storage | SQLite + filesystem (uploads) |
| PDF Viewer | PDF.js + IndexedDB cache |
| OCR | Tesseract.js (via CDN) |

---

## 1. CRITICAL: Keamanan (Security)

### 1.1 Hardcoded Secrets
**Lokasi:** `server/utils.js:6`, `server/index.js:15`

```js
// utils.js - JWT secret fallback
const secret = process.env.ADMIN_SECRET || 'devsecret';

// server/index.js - Admin code fallback
const ADMIN_CODE = process.env.ADMIN_CODE || 'admincode';
```

**Risiko:** Jika environment variable tidak di-set, aplikasi berjalan dengan secrets yang bisa ditebak. Token JWT bisa dipalsukan.

**Perbaikan:** Start tanpa fallback — gagal jika env tidak di-set:
```js
const secret = process.env.ADMIN_SECRET;
if (!secret) throw new Error('ADMIN_SECRET environment variable is required');
```

### 1.2 CORS Terbuka
**Lokasi:** `server/index.js:20`

```js
app.use(cors());
```

**Risiko:** Origin mana pun bisa mengakses API. Bisa dieksploitasi untuk CSRF-like attacks.

**Perbaikan:** Batasi origin:
```js
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:4000' }));
```

### 1.3 Tidak Ada Rate Limiting
**Risiko:** Endpoint `/admin/verify` bisa di-brute force. Tidak ada proteksi DDoS.

**Perbaikan:** Tambahkan `express-rate-limit`:
```js
const rateLimit = require('express-rate-limit');
app.use('/admin/verify', rateLimit({ windowMs: 15*60*1000, max: 5 }));
```

### 1.4 Static Files Mengekspos Seluruh Proyek
**Lokasi:** `server/index.js:24`

```js
app.use('/', express.static(path.join(__dirname, '..')));
```

**Risiko:** File `.env`, `server/`, `node_modules/`, dan source code bisa diakses langsung via URL.

**Perbaikan:** Hanya serve `public/` directory:
```js
app.use('/', express.static(path.join(__dirname, '..', 'public')));
```

### 1.5 Tidak Ada Input Sanitization
**Risiko:** XSS melalui field `title`, `description`, `md` yang di-render tanpa sanitasi.

**Perbaikan:** Gunakan DOMPurify saat rendering markdown, atau escape input di server.

### 1.6 Admin Token di SessionStorage
**Risiko:** Token hilang saat tab ditutup (sebenarnya ini fitur, tapi user tidak tahu expiration 30 menit tanpa refresh mechanism).

---

## 2. CRITICAL: Arsitektur & Code Quality

### 2.1 God Object: `main.js` (1269 baris)
Satu file menangani SEMUA: state management, rendering, API calls, PDF viewer, lightbox, admin panel, sidebar, search.

**Masalah:**
- Sulit di-maintain
- Sulit di-test
- Mudah bug saat edit satu fitur
- Tidak bisa lazy-load bagian tertentu

**Perbaikan:** Split ke modules:
```
src/
├── main.js              # Entry point, mountApp()
├── state.js             # appState, state management
├── api.js               # apiRequest, fetch wrappers
├── views/
│   ├── recipe.js        # renderRecipe, createRecipeContent
│   ├── gallery.js       # renderGallery
│   ├── notes.js         # renderNotes
│   └── admin.js         # renderAdmin, renderAdminForm
├── components/
│   ├── lightbox.js      # openModal, closeModal, showLightboxForItems
│   ├── sidebar.js       # updateSidebar, openSidebar, closeSidebar
│   ├── pdf-viewer.js    # initPdfViewer
│   └── header.js        # (sudah ada tapi tidak terpakai)
├── utils.js             # filterRecipes, getThumbPath, IDB helpers
└── content/             # Markdown resep
```

### 2.2 Component Files Tidak Terpakai
**Lokasi:** `src/components/header.js`, `src/components/sidebar.js`

Kedua file ini meng-`export` function tapi tidak pernah di-import di `main.js`. Mereka juga tidak menggunakan CSS classes yang sama dengan yang ada di `index.html`.

**Perbaikan:** Hapus atau refactor ke dalam arsitektur modular yang baru.

### 2.3 Duplicate CSS
`paper-texture` dan `scanned-page-shadow` didefinisikan di DUA file:
- `src/styles.css:1-8`
- `src/input.css:5-12`

**Perbaikan:** Pindahkan semua custom CSS ke `src/styles.css` saja, jadikan `input.css` hanya berisi Tailwind directives.

### 2.4 Hardcoded Content vs Dynamic Content
`createRecipeContent()` (main.js:159-229) menampilkan konten HTML hardcoded untuk setiap resep, bukan dari file markdown. Padahal setiap resep punya file `.md` yang tidak dibaca.

**Perbaikan:** Load dan render markdown file:
```js
async function createRecipeContent(recipe) {
  const response = await fetch(`/${recipe.md}`);
  const md = await response.text();
  return renderMarkdown(md);
}
```

### 2.5 README Tidak Sinkron
**Lokasi:** `README.md:17-36`

Struktur proyek yang dideskripsikan di README tidak sesuai aktual. Contoh:
- README menyebut `tailwind.config.js` tapi file ini di-`.gitignore`
- README tidak menyebut `server/` directory
- README tidak menyebut `src/pages/`

---

## 3. HIGH: Performance

### 3.1 Tailwind via CDN
**Lokasi:** `index.html:6`

```html
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
```

**Masalah:**
- Tidak recommended untuk production
- Generate CSS di browser (slow initial render)
- Tidak bisa tree-shake unused classes
- ~300KB+ download setiap kali

**Perbaikan:** Build Tailwind locally:
```bash
npm install -D tailwindcss
npx tailwindcss -i src/input.css -o dist/styles.css --minify
```

### 3.2 External Resources Tanpa Preloading
**Lokasi:** `index.html:7-9`

3 Google Fonts requests + Material Icons tanpa `<link rel="preload">`.

**Perbaikan:**
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" as="style">
```

### 3.3 Library Dimuat Tanpa Filter
- `tesseract.js` (~2MB) dimuat meski OCR jarang dipakai
- `pdf.js` dimuat meski banyak resep berupa gambar

**Perbaikan:** Lazy load:
```js
async function loadOCR() {
  if (!window.Tesseract) {
    await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@2.1.5/dist/tesseract.min.js');
  }
}
```

### 3.4 Tidak Ada Build Process
Tidak ada minification, bundling, atau tree-shaking. Semua JS/CSS di-load mentah.

**Perbaikan:** Tambahkan Vite atau esbuild untuk build pipeline.

### 3.5 Tidak Ada Service Worker
Untuk website arsip keluarga, offline access sangat penting.

**Perbaikan:** Daftarkan service worker untuk cache aset statis.

---

## 4. MEDIUM: Frontend UX

### 4.1 Tidak Ada SPA Routing
URL selalu `/` — tidak bisa share link ke resep tertentu, tidak ada browser history.

**Perbaikan:** Gunakan hash routing:
```js
window.addEventListener('hashchange', () => {
  const recipeId = location.hash.slice(1);
  if (recipeId) renderRecipe(recipeId);
});
```

### 4.2 Tidak Ada Dark Mode Toggle
Config Tailwind sudah ada (`darkMode: "class"`), tapi tidak ada UI untuk toggle.

**Perbaikan:** Tambahkan tombol toggle di header, simpan preferensi di localStorage.

### 4.3 Tidak Ada Loading States
Saat load resep, PDF, atau gallery — tidak ada indikator loading. User hanya melihat blank area.

**Perbaikan:** Tambahkan skeleton/spinner:
```js
contentDiv.innerHTML = '<div class="animate-pulse space-y-4"><div class="h-8 bg-slate-200 rounded w-1/3"></div>...</div>';
```

### 4.4 Tidak Ada Error Handling UI
Jika fetch gagal atau PDF rusak, tidak ada feedback ke user.

**Perbaikan:** Tambahkan error boundary:
```js
try {
  renderRecipe(recipeId);
} catch (error) {
  contentDiv.innerHTML = `<div class="text-red-500 p-8">Gagal memuat resep. <button onclick="location.reload()">Coba lagi</button></div>`;
}
```

### 4.5 Accessibility (A11y) Kurang
- Sidebar toggle tidak ada `aria-expanded`
- Recipe links tidak ada `aria-current`
- Search input tidak ada `aria-label`
- Tidak ada skip navigation yang proper

### 4.6 Tidak Ada Print Styles
User tidak bisa print resep dengan rapi.

**Perbaikan:** Tambahkan `@media print` di CSS.

### 4.7 Tidak Ada SEO
- Tidak ada `<meta name="description">`
- Tidak ada Open Graph tags
- Tidak ada structured data (Schema.org Recipe)
- Tidak ada sitemap

### 4.8 Tidak Ada Favicon
Website tidak punya favicon.

---

## 5. MEDIUM: Backend

### 5.1 Tidak Ada Input Validation Library
Validasi manual dengan if-statements. Rentan terhadap edge cases.

**Perbaikan:** Gunakan `zod` atau `joi`:
```js
const schema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000),
  category: z.string().max(100),
});
```

### 5.2 Tidak Ada Error Handling Middleware
`console.error(err)` di setiap endpoint. Tidak ada centralized error handler.

**Perbaikan:**
```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
```

### 5.3 Database Tanpa Migrations
Schema langsung di `CREATE TABLE IF NOT EXISTS`. Tidak ada versi schema atau migration.

**Perbaikan:** Gunakan `knex` migrations atau minimal tambahkan version tracking.

### 5.4 Tidak Ada Pagination
`GET /api/recipes` return semua data sekaligus.

**Perbaikan:** Tambahkan query params:
```
GET /api/recipes?page=1&limit=20
```

### 5.5 Tidak Ada Logging
Hanya `console.error` dan `console.log`. Tidak ada structured logging.

**Perbaikan:** Gunakan `pino` atau `winston` untuk production logging.

### 5.6 Tidak Ada Health Check Endpoint
```
GET /health -> { status: 'ok', db: 'connected' }
```

### 5.7 Tidak Ada Graceful Shutdown
Server tidak handle `SIGTERM`/`SIGINT` dengan proper cleanup.

**Perbaikan:**
```js
process.on('SIGTERM', () => {
  server.close(() => db.close());
});
```

### 5.8 File Upload Tanpa Virus Scanning
Upload file PDF/images tanpa validasi content type yang proper (hanya cek extension).

**Perbaikan:** Validasi magic bytes, atau gunakan `file-type` package.

---

## 6. LOW: Hal Lain yang Perlu Diperhatikan

### 6.1 Gallery Hanya Placeholder
`galleryItems` di `main.js:60-79` menggunakan SVG placeholder, bukan foto asli.

### 6.2 Deskripsi Resep Terlalu Pendek
Beberapa resep hanya punya 2-3 kata deskripsi. Kurang SEO-friendly.

### 6.3 Tidak Ada Favorit/Rating
User tidak bisa menandai resep favorit.

### 6.4 Tidak Ada Export
Tidak ada fitur export ke PDF atau print-friendly version.

### 6.5 Data Resep Duplikat
Resep hardcoded di `main.js` DAN tersimpan di database. Frontend tidak sync dengan backend.

### 6.6 `pages/index.html` Tidak Terpakai
File ini tidak direferensikan di mana pun.

### 6.7 Typography Bisa Lebih Baik
Body text menggunakan `font-display` (Plus Jakarta Sans) — untuk website resep, serif bisa lebih cocok untuk konten.

---

## 7. Rekomendasi Prioritas

| Prioritas | Item | Estimasi |
|-----------|------|----------|
| **P0** | Fix hardcoded secrets, CORS, static file exposure | 1-2 jam |
| **P0** | Rate limiting pada admin endpoints | 1 jam |
| **P1** | Split `main.js` ke modules | 4-6 jam |
| **P1** | Build Tailwind locally + bundling | 2-3 jam |
| **P1** | Load resep dari markdown files | 2 jam |
| **P2** | SPA routing (hash-based) | 2-3 jam |
| **P2** | Loading states & error handling | 2-3 jam |
| **P2** | Dark mode toggle | 1-2 jam |
| **P2** | Input validation (zod) | 2 jam |
| **P3** | Service worker untuk offline | 3-4 jam |
| **P3** | Print styles | 1-2 jam |
| **P3** | SEO (meta tags, structured data) | 2 jam |
| **P3** | Admin panel sync dengan database | 3-4 jam |

---

## 8. Quick Wins (Bisa Langsung Dilakukan)

1. **Hapus duplicate CSS** di `input.css` (pindah ke `styles.css`)
2. **Hapus file tidak terpakai**: `src/components/header.js`, `src/components/sidebar.js`, `src/pages/index.html`
3. **Tambahkan `<meta name="description">`** di `index.html`
4. **Tambahkan favicon** (bisa gunakan ikon `menu_book` dari Material Symbols)
5. **Sync README** dengan struktur proyek aktual
6. **Tambahkan `.env.example`** untuk dokumentasi environment variables

---

*Dianalisis pada: 27 Agustus 2026*
*Versi analisis: v1.0*
