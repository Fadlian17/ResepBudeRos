# Ibu's Digital Archive

Website arsip resep tulisan tangan Ibu — mengabadikan warisan kuliner keluarga dalam format digital.

## Fitur

- **Responsive Design:** Desktop, tablet, dan mobile-friendly dengan Tailwind CSS.
- **Tiga Panel Layout:** Sidebar navigasi, konten resep, dan panel scan original (desktop).
- **Search Aktif:** Cari resep berdasarkan nama, kategori, atau ID secara real-time.
- **Split View Desktop:** Tampilkan teks resep di tengah dan scan asli di sebelah kanan.
- **Mobile Sidebar:** Sidebar slide-in dengan overlay untuk navigasi mobile.
- **Metadata & Chef's Notes:** Setiap resep memiliki informasi tanggal scan, lokasi, dan catatan khusus.

## Struktur Proyek

```
resep-ibu-archive/
├── public/
│   ├── scans/              # File scan PDF/JPG resep asli
│   │   ├── ayam-kecap.pdf
│   │   ├── sayur-asem.jpg
│   │   └── ...
│   └── fonts/
├── src/
│   ├── main.js             # Logic utama (search, load recipe, sidebar toggle)
│   ├── styles.css          # Custom CSS (paper texture, shadows)
│   ├── input.css           # Tailwind directives
│   ├── components/         # Komponen helper (header, sidebar)
│   └── content/            # Markdown resep
│       ├── ayam-kecap.md
│       ├── sayur-asem.md
│       └── ...
├── index.html              # Entry point utama
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind config
└── README.md
```

## Setup & Menjalankan

### Prerequisites
- Node.js (untuk `npx serve`)

### Instalasi & Run
```bash
# Clone atau download project
cd resep-ibu-archive

# Install dependencies (opsional, hanya jika npm start error)
npm install

# Jalankan dev server
npm start
```

Buka browser ke **http://localhost:5000** (atau port yang ditampilkan).

## Cara Pakai

1. **Tambah Resep Baru:**
   - Buat file `.md` di `src/content/namaresep.md` dengan format YAML frontmatter + markdown content.
   - Tambahkan scan PDF/JPG ke `public/scans/`.
   - Update array `recipes` di `src/main.js` dengan data resep baru.

2. **Search:**
   - Ketik nama resep, kategori, atau kata kunci di search bar header.
   - Sidebar akan filter otomatis.

3. **Navigasi:**
   - Desktop: 3 panel lengkap (sidebar, content, scan).
   - Tablet: 2 panel (sidebar hilang, content full + scan hilang).
   - Mobile: Content full, sidebar slide-in toggle.

## Teknologi

- **HTML5 & Vanilla JavaScript** (tanpa framework berat)
- **Tailwind CSS** via CDN
- **Marked.js** untuk parsing markdown
- **Google Material Symbols** untuk ikon

## Warna & Brand

- **Primary Color:** `#d47311` (oranye warm)
- **Background Light:** `#f8f7f6` (cream/paper)
- **Font Display:** Plus Jakarta Sans
- **Font Serif:** Instrument Serif

## Planning & TODO

- [ ] OCR/text extraction dari PDF scan (menggunakan `ocrmypdf` atau `tesseract`)
- [ ] Export resep ke PDF atau print-friendly
- [ ] Dark mode toggle
- [ ] Filter advanced (by ingredients, cook time)
- [ ] Rating/favorit resep
- [ ] Kategori tambahan (drinks, snacks)
- [ ] Backend & database untuk mengelola resep dinamis
- [ ] Tambah fitur kolaboratif (share, comment)

## Notes

- Desain didasarkan pada [Google Stitch project](https://stitch.withgoogle.com) dengan adaptasi lokal.
- Metadata & scan placeholder saat ini menggunakan data hardcoded; bisa dinamis dengan backend.
- Responsive breakpoints: mobile < 768px, tablet 768px - 1023px, desktop ≥ 1024px.

## Thumbnails (performance)

- Place optimized thumbnail images under `public/gallery/thumbs/` and `public/scans/thumbs/`.
- Thumbnails should use the same filename as the original but in WebP (recommended), e.g.:
   `public/gallery/family-1.svg` -> `public/gallery/thumbs/family-1.webp`.
- The app will automatically attempt to load thumbnails via `srcset` and fall back to the original image if the thumbnail is missing.

---

**Didedikasikan untuk Ibu dan warisan resep keluarga.**
