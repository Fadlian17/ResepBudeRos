# Resep Ibu Archive

Situs arsip resep tulisan tangan ibu — boilerplate sederhana.

Struktur dasar:

resep-ibu-archive/
├── public/
│   ├── scans/
│   └── fonts/
├── src/
│   ├── content/
│   ├── components/
│   └── pages/
├── package.json
└── README.md

Cara menjalankan (butuh Node.js untuk `npx`):

1. Install (opsional): `npm install`
2. Jalankan server statis: `npm start`

Lalu buka http://localhost:5000 atau port yang ditampilkan oleh `serve`.

Cerita singkat: Isi file `src/content/*.md` dengan resep yang sudah Anda ketik ulang, dan taruh hasil scan di `public/scans/`.
