# P1: Modular Architecture + Build System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor 1269-line `main.js` into focused modules, set up local Tailwind build with Vite, and load recipe content from markdown files instead of hardcoded HTML.

**Architecture:** Split monolithic `main.js` into ~10 focused modules organized by responsibility. Use Vite as build tool for dev server + production bundling. Tailwind CSS built locally via PostCSS. Recipe markdown files fetched and parsed at runtime via Marked.js.

**Tech Stack:** Vite (bundler), Tailwind CSS (local build), PostCSS, Marked.js, vanilla JS modules (ESM)

---

## File Structure (Target)

```
ResepBudeRos/
├── package.json                 # NEW - dependencies
├── vite.config.js               # NEW - Vite configuration
├── postcss.config.js            # NEW - PostCSS for Tailwind
├── tailwind.config.js           # NEW - Tailwind configuration
├── index.html                   # MODIFY - move to root, add module script
├── src/
│   ├── main.js                  # MODIFY - entry point only (~30 lines)
│   ├── state.js                 # NEW - appState management
│   ├── api.js                   # NEW - API request helpers
│   ├── utils.js                 # NEW - filterRecipes, getThumbPath, IDB helpers
│   ├── views/
│   │   ├── recipe.js            # NEW - renderRecipe, createRecipeContent
│   │   ├── gallery.js           # NEW - renderGallery
│   │   ├── notes.js             # NEW - renderNotes
│   │   └── admin.js             # NEW - renderAdmin, renderAdminForm
│   ├── components/
│   │   ├── lightbox.js          # NEW - openModal, closeModal, showLightboxForItems
│   │   ├── sidebar.js           # NEW - updateSidebar, openSidebar, closeSidebar
│   │   ├── pdf-viewer.js        # NEW - initPdfViewer
│   │   └── header.js            # DELETE - unused
│   ├── styles/
│   │   └── main.css             # NEW - @tailwind directives + custom CSS
│   └── content/                 # EXISTING - markdown recipes
│       ├── sayur-asem.md
│       └── ayam-kecap.md
├── public/                      # EXISTING - static assets
│   ├── scans/
│   └── gallery/
└── server/                      # EXISTING - backend (unchanged)
```

---

## Task 1: Package.json & Build Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `postcss.config.js`
- Create: `tailwind.config.js`

**Dependencies:**
- `vite` - build tool & dev server
- `tailwindcss` - utility CSS framework
- `postcss` - CSS processing
- `autoprefixer` - vendor prefixes

- [ ] **Step 1: Create package.json**

```json
{
  "name": "resep-bude-ros",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/index.js"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "better-sqlite3": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",
    "slugify": "^1.6.6",
    "uuid": "^9.0.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/admin': 'http://localhost:4000',
      '/health': 'http://localhost:4000',
    },
  },
});
```

- [ ] **Step 3: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#d47311',
        'background-light': '#f8f7f6',
        'background-dark': '#221910',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Run npm install**

```bash
cd /Users/fadliicondigi/Downloads/ResepBudeRos/ResepBudeRos
npm install
```

Expected: Dependencies installed, node_modules created

- [ ] **Step 6: Verify Vite works**

```bash
npm run dev
```

Expected: Dev server starts on http://localhost:5173

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.js postcss.config.js tailwind.config.js
git commit -m "feat: add Vite build system with Tailwind CSS"
```

---

## Task 2: CSS Migration

**Files:**
- Create: `src/styles/main.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: Tailwind config from Task 1
- Produces: Single CSS file with Tailwind utilities + custom styles

- [ ] **Step 1: Create src/styles/main.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Paper texture background */
.paper-texture {
  background-color: #f8f7f6;
  background-image: url('data:image/svg+xml,...'); /* inline or use local asset */
}

/* Scanned page shadow */
.scanned-page-shadow {
  box-shadow: 0 10px 30px -10px rgba(34, 25, 16, 0.2), 0 4px 6px -4px rgba(34, 25, 16, 0.1);
}

/* Lightbox */
#lightbox-overlay {
  display: none;
}
#lightbox-overlay.open {
  display: flex;
}
#lightbox-content img,
#lightbox-content embed {
  width: 100%;
  height: 70vh;
  object-fit: contain;
}

/* Thumbnail scroller */
.thumb-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 12px 0;
  scroll-snap-type: x mandatory;
}
.thumb-scroll::-webkit-scrollbar {
  height: 8px;
}
.thumb-scroll::-webkit-scrollbar-thumb {
  background: rgba(34, 25, 16, 0.25);
  border-radius: 999px;
}
.thumb-card {
  min-width: 180px;
  flex: 0 0 auto;
  scroll-snap-align: start;
  border: 1px solid rgba(34, 25, 16, 0.12);
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.thumb-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.thumb-card img {
  height: 110px;
  width: 100%;
  object-fit: cover;
}
.thumb-card .thumb-title {
  padding: 10px 12px;
  font-weight: 700;
  font-size: 0.9rem;
  color: #1f2937;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .layout-container {
    padding: 0;
  }
  #content {
    border-right: none;
  }
}

@media (max-width: 1024px) {
  #scan-panel {
    display: none !important;
  }
}
```

- [ ] **Step 2: Update index.html**

Replace CDN Tailwind script with local CSS:
```html
<!-- REMOVE this line -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<!-- REMOVE this script block -->
<script id="tailwind-config">
  tailwind.config = { ... }
</script>

<!-- ADD this line -->
<link rel="stylesheet" href="/src/styles/main.css">
```

- [ ] **Step 3: Verify styles load**

```bash
npm run dev
```

Expected: Page renders with correct styles (no CDN fetch)

- [ ] **Step 4: Commit**

```bash
git add src/styles/main.css index.html
git commit -m "feat: migrate to local Tailwind CSS build"
```

---

## Task 3: Module Split - State & Utils

**Files:**
- Create: `src/state.js`
- Create: `src/utils.js`

**Interfaces:**
- Consumes: Recipe data from main.js
- Produces: `appState`, `filterRecipes()`, `getThumbPath()`, IDB helpers

- [ ] **Step 1: Create src/state.js**

```javascript
export const recipes = [
  {
    id: 'sayur-asem',
    title: "Ibu's Sayur Asem",
    description: 'A refreshing sweet and sour vegetable soup from West Java.',
    category: 'Soups',
    md: 'src/content/sayur-asem.md',
    scan: 'public/scans/reseppart1.pdf',
    metadata: {
      dateScanned: 'Oct 12, 2023',
      originalYear: 'Jakarta 1990',
      location: 'East Jakarta, Jakarta',
      format: 'Hardbound Notebook'
    }
  },
  {
    id: 'ayam-kecap',
    title: 'Ayam Kecap',
    description: 'Sweet soy sauce chicken dish.',
    category: 'Main Dishes',
    md: 'src/content/ayam-kecap.md',
    scan: 'public/scans/ayam-kecap.pdf',
    metadata: {
      dateScanned: 'Oct 12, 2023',
      originalYear: 'Circa 1985',
      location: 'East Jakarta, Jakarta',
      format: 'Hardbound Notebook'
    }
  },
  {
    id: 'soto-ayam',
    title: 'Soto Ayam Kampung',
    description: 'Traditional chicken soup.',
    category: 'Soups',
    md: 'src/content/soto-ayam.md',
    scan: 'public/scans/soto.jpeg',
    metadata: {
      dateScanned: 'Oct 12, 2023',
      originalYear: 'Jakarta 1990',
      location: 'East Jakarta, Jakarta',
      format: 'Hardbound Notebook'
    }
  },
  {
    id: 'sup-buntut',
    title: 'Sup Buntut',
    description: 'Oxtail soup.',
    category: 'Soups',
    md: 'src/content/sup-buntut.md',
    scan: 'public/scans/reseppart1.pdf',
    metadata: {
      dateScanned: 'Oct 12, 2023',
      originalYear: 'Jakarta 1990',
      location: 'East Jakarta, Jakarta',
      format: 'Hardbound Notebook'
    }
  }
];

export const galleryItems = [
  {
    id: 'family-1',
    title: 'Family Moment',
    src: 'public/gallery/family-1.svg',
    caption: 'A warm day in the kitchen with grandma.',
  },
  {
    id: 'family-2',
    title: "Grandma's Kitchen",
    src: 'public/gallery/family-2.svg',
    caption: 'Dinner table stories and recipes.',
  },
  {
    id: 'family-3',
    title: 'Holiday Memories',
    src: 'public/gallery/family-3.svg',
    caption: 'Moments we save in our hearts.',
  }
];

export const appState = {
  view: 'recipes',
  activeRecipeId: 'sayur-asem',
  searchQuery: '',
  galleryPage: 1,
  galleryPerPage: 6,
  pdfViewers: {},
};
```

- [ ] **Step 2: Create src/utils.js**

```javascript
import { appState } from './state.js';

export function filterRecipes(recipes, query = '') {
  const q = (query || '').trim().toLowerCase();
  if (!q) return recipes;
  return recipes.filter(r => {
    return r.id.toLowerCase().includes(q)
      || r.title.toLowerCase().includes(q)
      || (r.description || '').toLowerCase().includes(q)
      || (r.category || '').toLowerCase().includes(q);
  });
}

export function getThumbPath(path) {
  try {
    return path.replace(/^public\/(gallery|scans)\//, 'public/$1/thumbs/').replace(/\.[^.]+$/, '.webp');
  } catch (e) {
    return path;
  }
}

// IndexedDB helpers for caching
export function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('resep-cache', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pdf-thumbs')) db.createObjectStore('pdf-thumbs');
      if (!db.objectStoreNames.contains('pdf-pages')) db.createObjectStore('pdf-pages');
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function idbGet(store, key) {
  try {
    const db = await openIDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const r = os.get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  } catch (e) {
    return null;
  }
}

export async function idbPut(store, key, value) {
  try {
    const db = await openIDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      const r = os.put(value, key);
      r.onsuccess = () => resolve(true);
      r.onerror = () => reject(r.error);
    });
  } catch (e) {
    return false;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/state.js src/utils.js
git commit -m "feat: extract state and utils modules"
```

---

## Task 4: Module Split - Components

**Files:**
- Create: `src/components/sidebar.js`
- Create: `src/components/lightbox.js`
- Create: `src/components/pdf-viewer.js`
- Delete: `src/components/header.js` (unused)

**Interfaces:**
- Consumes: `appState` from state.js, DOM elements
- Produces: Sidebar, lightbox, PDF viewer functions

- [ ] **Step 1: Create src/components/sidebar.js**

```javascript
import { appState } from '../state.js';
import { filterRecipes } from '../utils.js';
import { recipes } from '../state.js';
import { renderRecipe } from '../views/recipe.js';

export function setActiveViewButton(view) {
  document.querySelectorAll('[data-view]').forEach(btn => {
    const isActive = btn.getAttribute('data-view') === view;
    btn.classList.toggle('bg-primary/10', isActive);
    btn.classList.toggle('text-primary', isActive);
    btn.classList.toggle('text-slate-600', !isActive);
    btn.classList.toggle('font-bold', isActive);
  });
}

export function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}

export function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('-translate-x-full');
  overlay.classList.remove('hidden');
}

export function updateSidebar(filteredRecipes) {
  const categoriesDiv = document.getElementById('categories');
  categoriesDiv.innerHTML = '';

  const grouped = {};
  filteredRecipes.forEach(recipe => {
    if (!grouped[recipe.category]) grouped[recipe.category] = [];
    grouped[recipe.category].push(recipe);
  });

  Object.keys(grouped).forEach(category => {
    const categoryDiv = document.createElement('div');
    const icon = category === 'Soups' ? 'restaurant' : category === 'Main Dishes' ? 'skillet' : 'icecream';
    const categoryIsActive = grouped[category].some(r => r.id === appState.activeRecipeId);

    categoryDiv.innerHTML = `
      <div class="flex items-center gap-2 px-3 py-1 mb-1">
        <span class="material-symbols-outlined text-${categoryIsActive ? 'primary' : 'slate-400'} text-sm">${icon}</span>
        <span class="text-${categoryIsActive ? 'slate-900' : 'slate-600'} font-bold text-sm">${category}</span>
      </div>
      <div class="ml-6 space-y-1">
        ${grouped[category]
          .map(recipe => `
            <a class="block px-3 py-2 rounded-lg ${recipe.id === appState.activeRecipeId ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-600 hover:text-primary transition-colors'} text-sm font-medium recipe-link" href="#" data-recipe="${recipe.id}">${recipe.title}</a>
          `)
          .join('')}
      </div>
    `;

    categoriesDiv.appendChild(categoryDiv);
  });

  // Attach listeners to recipe links
  document.querySelectorAll('.recipe-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const recipeId = e.target.getAttribute('data-recipe');
      setView('recipes');
      renderRecipe(recipeId);
      if (window.innerWidth < 768) closeSidebar();
    });
  });
}
```

- [ ] **Step 2: Create src/components/lightbox.js**

```javascript
import { appState } from '../state.js';
import { getThumbPath } from '../utils.js';

export function openModal(contentHtml) {
  const overlay = document.getElementById('lightbox-overlay');
  const content = document.getElementById('lightbox-content');
  appState._previouslyFocusedElement = document.activeElement;
  content.innerHTML = contentHtml;
  overlay.classList.remove('hidden');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    const focusable = overlay.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable && focusable.length ? focusable[0] : overlay;
    first.focus();
  }, 10);

  appState._modalKeyHandler = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === 'ArrowLeft') {
      const prev = document.getElementById('lightbox-prev');
      if (prev && !prev.disabled) prev.click();
      return;
    }
    if (e.key === 'ArrowRight') {
      const next = document.getElementById('lightbox-next');
      if (next && !next.disabled) next.click();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = Array.from(overlay.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null);
      if (!focusable.length) {
        e.preventDefault();
        return;
      }
      const idx = focusable.indexOf(document.activeElement);
      if (e.shiftKey && idx === 0) {
        focusable[focusable.length - 1].focus();
        e.preventDefault();
      } else if (!e.shiftKey && idx === focusable.length - 1) {
        focusable[0].focus();
        e.preventDefault();
      }
    }
  };

  document.addEventListener('keydown', appState._modalKeyHandler);
}

export function closeModal() {
  const overlay = document.getElementById('lightbox-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');

  const content = document.getElementById('lightbox-content');
  content.innerHTML = '';

  if (appState._modalKeyHandler) {
    document.removeEventListener('keydown', appState._modalKeyHandler);
    appState._modalKeyHandler = null;
  }

  try {
    if (appState._previouslyFocusedElement && typeof appState._previouslyFocusedElement.focus === 'function') {
      appState._previouslyFocusedElement.focus();
    }
  } catch (e) {}
  appState._previouslyFocusedElement = null;
}

export function showLightboxForItems(items, startIndex = 0) {
  appState.galleryItems = items;
  appState.lightboxIndex = startIndex;

  function renderLightbox() {
    const item = appState.galleryItems[appState.lightboxIndex];
    const prevDisabled = appState.lightboxIndex === 0;
    const nextDisabled = appState.lightboxIndex === appState.galleryItems.length - 1;
    const html = `
      <div class="relative bg-white rounded-xl overflow-hidden shadow-lg">
        <div class="flex items-center justify-between p-4 border-b border-primary/10">
          <div>
            <h3 class="font-bold text-lg text-slate-900">${item.title}</h3>
            <p class="text-slate-600 text-sm">${item.caption}</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="lightbox-prev" class="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50" ${prevDisabled ? 'disabled' : ''} aria-label="Previous">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button id="lightbox-next" class="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50" ${nextDisabled ? 'disabled' : ''} aria-label="Next">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div class="p-4">
          <div class="aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden relative" id="lightbox-media-wrap">
            <div id="lightbox-toolbar" class="absolute top-3 right-3 z-20 flex items-center gap-2">
              <button id="lightbox-zoom-out" class="p-2 rounded-md bg-white/90 shadow-sm" aria-label="Zoom out">-</button>
              <button id="lightbox-zoom-fit" class="p-2 rounded-md bg-white/90 shadow-sm" aria-label="Fit">⤢</button>
              <button id="lightbox-zoom-in" class="p-2 rounded-md bg-white/90 shadow-sm" aria-label="Zoom in">+</button>
            </div>
            <div id="lightbox-media" class="w-full h-full flex items-center justify-center bg-slate-100">
              ${item.src.endsWith('.pdf')
                ? `<embed src="/${item.src}" type="application/pdf" class="w-full h-full object-cover" />`
                : (() => { const thumb = getThumbPath(item.src); return `<img id="lightbox-img" src="/${thumb}" srcset="/${thumb} 800w, /${item.src} 1600w" sizes="(max-width:640px) 90vw, 1200px" alt="${item.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${item.src}'; this.removeAttribute('srcset');" class="max-w-full max-h-full object-contain touch-manipulation" style="transform-origin:center center;"/>`; })()}
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-primary/10 text-left">
          <div id="lightbox-caption" class="text-slate-700 text-sm">${item.caption}</div>
        </div>
        <div class="p-4 border-t border-primary/10 text-right">
          <button id="lightbox-close-btn" class="px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:bg-primary/90">Close</button>
        </div>
      </div>
    `;
    openModal(html);

    document.getElementById('lightbox-prev')?.addEventListener('click', () => {
      if (appState.lightboxIndex > 0) {
        appState.lightboxIndex -= 1;
        renderLightbox();
      }
    });
    document.getElementById('lightbox-next')?.addEventListener('click', () => {
      if (appState.lightboxIndex < appState.galleryItems.length - 1) {
        appState.lightboxIndex += 1;
        renderLightbox();
      }
    });
    document.getElementById('lightbox-close-btn')?.addEventListener('click', closeModal);

    // Preload neighbors
    const preloadImage = (idx) => {
      if (idx < 0 || idx >= appState.galleryItems.length) return;
      const src = appState.galleryItems[idx].src;
      if (!src || src.endsWith('.pdf')) return;
      const img = new Image();
      img.src = `/${appState.galleryItems[idx].src}`;
    };
    preloadImage(appState.lightboxIndex - 1);
    preloadImage(appState.lightboxIndex + 1);

    // Zoom/pan handlers (same as original)
    const imgEl = document.getElementById('lightbox-img');
    if (imgEl) {
      imgEl.dataset.scale = '1';
      imgEl.dataset.translateX = '0';
      imgEl.dataset.translateY = '0';
      const setTransform = () => {
        const s = parseFloat(imgEl.dataset.scale || '1');
        const tx = parseFloat(imgEl.dataset.translateX || '0');
        const ty = parseFloat(imgEl.dataset.translateY || '0');
        imgEl.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      };

      imgEl.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const delta = ev.deltaY > 0 ? -0.1 : 0.1;
        let s = parseFloat(imgEl.dataset.scale || '1');
        s = Math.min(4, Math.max(0.5, s + delta));
        imgEl.dataset.scale = s.toString();
        setTransform();
      }, { passive: false });

      document.getElementById('lightbox-zoom-in')?.addEventListener('click', () => {
        let s = parseFloat(imgEl.dataset.scale || '1'); s = Math.min(4, s + 0.25); imgEl.dataset.scale = s; setTransform();
      });
      document.getElementById('lightbox-zoom-out')?.addEventListener('click', () => {
        let s = parseFloat(imgEl.dataset.scale || '1'); s = Math.max(0.5, s - 0.25); imgEl.dataset.scale = s; setTransform();
      });
      document.getElementById('lightbox-zoom-fit')?.addEventListener('click', () => {
        imgEl.dataset.scale = '1'; imgEl.dataset.translateX = '0'; imgEl.dataset.translateY = '0'; setTransform();
      });

      let pointerActive = false;
      let startX = 0, startY = 0, startTx = 0, startTy = 0;
      imgEl.addEventListener('pointerdown', (e) => {
        imgEl.setPointerCapture(e.pointerId);
        pointerActive = true;
        startX = e.clientX; startY = e.clientY;
        startTx = parseFloat(imgEl.dataset.translateX || '0'); startTy = parseFloat(imgEl.dataset.translateY || '0');
      });
      imgEl.addEventListener('pointermove', (e) => {
        if (!pointerActive) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        imgEl.dataset.translateX = (startTx + dx).toString();
        imgEl.dataset.translateY = (startTy + dy).toString();
        setTransform();
      });
      imgEl.addEventListener('pointerup', (e) => { imgEl.releasePointerCapture(e.pointerId); pointerActive = false; });
      imgEl.addEventListener('pointercancel', () => { pointerActive = false; });
    }
  }

  renderLightbox();
}
```

- [ ] **Step 3: Create src/components/pdf-viewer.js**

```javascript
import { appState } from '../state.js';
import { idbGet, idbPut } from '../utils.js';

export async function initPdfViewer(recipeId, pdfUrl) {
  try {
    if (!window.pdfjsLib) return;
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    const canvas = document.getElementById(`pdf-canvas-${recipeId}`);
    const thumbsContainer = document.getElementById(`pdf-thumbs-${recipeId}`);
    const pageInfo = document.getElementById(`pdf-page-info-${recipeId}`);
    const prevBtn = document.getElementById(`pdf-prev-${recipeId}`);
    const nextBtn = document.getElementById(`pdf-next-${recipeId}`);
    const zoomIn = document.getElementById(`pdf-zoom-in-${recipeId}`);
    const zoomOut = document.getElementById(`pdf-zoom-out-${recipeId}`);

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdfDoc = await loadingTask.promise;
    const state = { pdfDoc, currentPage: 1, scale: 1.2 };
    appState.pdfViewers = appState.pdfViewers || {};
    appState.pdfViewers[recipeId] = state;

    const renderPage = async (num) => {
      const pageKey = `${recipeId}-page-${num}-scale-${state.scale}`;
      const cachedPage = await idbGet('pdf-pages', pageKey);
      if (cachedPage) {
        await new Promise((res) => {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            res();
          };
          img.onerror = () => res();
          img.src = cachedPage;
        });
        state.currentPage = num;
        if (pageInfo) pageInfo.textContent = `Page ${state.currentPage} / ${pdfDoc.numPages}`;
        return;
      }

      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: state.scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      const renderCtx = { canvasContext: ctx, viewport };
      await page.render(renderCtx).promise;

      try {
        const dataUrl = canvas.toDataURL('image/webp', 0.9);
        idbPut('pdf-pages', pageKey, dataUrl).catch(() => {});
      } catch (e) {}

      state.currentPage = num;
      if (pageInfo) pageInfo.textContent = `Page ${state.currentPage} / ${pdfDoc.numPages}`;
    };

    await renderPage(1);

    prevBtn?.addEventListener('click', async () => { if (state.currentPage > 1) await renderPage(state.currentPage - 1); });
    nextBtn?.addEventListener('click', async () => { if (state.currentPage < pdfDoc.numPages) await renderPage(state.currentPage + 1); });
    zoomIn?.addEventListener('click', async () => { state.scale = Math.min(3, state.scale + 0.25); await renderPage(state.currentPage); });
    zoomOut?.addEventListener('click', async () => { state.scale = Math.max(0.5, state.scale - 0.25); await renderPage(state.currentPage); });

    // Thumbnail generation
    if (thumbsContainer) {
      thumbsContainer.innerHTML = '';
      for (let p = 1; p <= pdfDoc.numPages; p++) {
        try {
          const thumbKey = `${recipeId}-thumb-${p}`;
          const cached = await idbGet('pdf-thumbs', thumbKey);
          if (cached) {
            const img = document.createElement('img');
            img.src = cached;
            img.className = 'rounded border p-1 bg-white flex-none';
            img.style.height = '64px';
            img.addEventListener('click', async () => { await renderPage(p); });
            thumbsContainer.appendChild(img);
            continue;
          }

          const page = await pdfDoc.getPage(p);
          const vp = page.getViewport({ scale: 0.18 });
          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = Math.floor(vp.width);
          thumbCanvas.height = Math.floor(vp.height);
          const thumbCtx = thumbCanvas.getContext('2d');
          await page.render({ canvasContext: thumbCtx, viewport: vp }).promise;
          const dataUrl = thumbCanvas.toDataURL('image/webp', 0.75);
          idbPut('pdf-thumbs', thumbKey, dataUrl).catch(() => {});

          const img = document.createElement('img');
          img.src = dataUrl;
          img.className = 'rounded border p-1 bg-white flex-none';
          img.style.height = '64px';
          img.addEventListener('click', async () => { await renderPage(p); });
          thumbsContainer.appendChild(img);
        } catch (e) {
          console.warn('thumb render failed', e);
        }
      }
    }
  } catch (err) {
    console.error('PDF viewer init failed', err);
  }
}
```

- [ ] **Step 4: Delete unused header.js**

```bash
rm src/components/header.js
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: extract sidebar, lightbox, and PDF viewer components"
```

---

## Task 5: Module Split - Views

**Files:**
- Create: `src/views/recipe.js`
- Create: `src/views/gallery.js`
- Create: `src/views/notes.js`
- Create: `src/views/admin.js`

**Interfaces:**
- Consumes: state.js, utils.js, components/*
- Produces: View rendering functions

- [ ] **Step 1: Create src/views/recipe.js**

```javascript
import { appState, recipes } from '../state.js';
import { getThumbPath } from '../utils.js';
import { initPdfViewer } from '../components/pdf-viewer.js';
import { updateSidebar } from '../components/sidebar.js';
import { filterRecipes } from '../utils.js';

function createRecipeContent(recipe) {
  return `
    <div>
      <h3 class="flex items-center gap-2 text-slate-900 font-bold text-xl mb-6 pb-2 border-b border-primary/20">
        <span class="material-symbols-outlined text-primary">shopping_basket</span>
        Ingredients
      </h3>
      <ul class="space-y-3 text-slate-700">
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>100g melinjo (seeds and leaves)</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>1 sweet corn, cut into rounds</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>50g raw peanuts</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>1 chayote, peeled and cubed</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>5-6 long beans, cut into 3cm lengths</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>3 large tamarind pods (asam jawa)</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>Salt and palm sugar to taste</span>
        </li>
      </ul>
    </div>
    <div>
      <h3 class="flex items-center gap-2 text-slate-900 font-bold text-xl mb-6 pb-2 border-b border-primary/20">
        <span class="material-symbols-outlined text-primary">description</span>
        Instructions
      </h3>
      <ol class="space-y-6 text-slate-700">
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
          <p class="pt-1">Boil 1.5 liters of water in a large pot. Add the peanuts, melinjo seeds, and corn. Cook until they begin to soften.</p>
        </li>
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
          <p class="pt-1">Stir in the spice paste (bumbu halus) and lemongrass. Simmer for 10 minutes to let the flavors meld.</p>
        </li>
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
          <p class="pt-1">Add the chayote and long beans. Cook until the vegetables are tender but still have a slight bite.</p>
        </li>
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</span>
          <p class="pt-1">Finally, add the tamarind water, palm sugar, and salt. Taste and adjust. It should be perfectly balanced between sour, sweet, and salty.</p>
        </li>
      </ol>
    </div>
    <div class="mt-8 bg-white/50 border-2 border-dashed border-primary/20 p-8 rounded-xl relative overflow-hidden">
      <span class="material-symbols-outlined absolute -top-4 -right-4 text-8xl text-primary/5 rotate-12">format_quote</span>
      <h4 class="text-primary font-bold text-sm uppercase tracking-widest mb-3">Chef's Note</h4>
      <p class="text-slate-800 font-serif text-2xl italic leading-relaxed">
        "Ibu always said: Don't forget the extra tamarind for freshness. It's the secret to a bright morning soup."
      </p>
    </div>
  `;
}

function createScanElement(recipe) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="scanned-page-shadow rounded-sm transition-transform duration-500 group-hover:rotate-1">
      <div class="aspect-[3/4] w-full bg-[#fdfaf5] border border-black/5 p-8 flex flex-col overflow-hidden relative">
        <div class="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
        <div class="absolute inset-0 opacity-10 bg-gradient-to-br from-yellow-900/20 to-transparent"></div>
        <div class="mb-4">
          <div class="h-8 w-48 bg-slate-900/10 rounded-sm mb-2 opacity-50"></div>
          <div class="h-4 w-32 bg-slate-900/5 rounded-sm opacity-50"></div>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="h-2 w-full bg-slate-900/5 rounded-full opacity-50"></div>
          </div>
          <div class="space-y-2 pl-4">
            <div class="h-2 w-3/4 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-4/5 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-2/3 bg-slate-900/5 rounded-full opacity-30"></div>
          </div>
        </div>
        ${recipe.scan.endsWith('.pdf') ?
          `<div id="pdf-viewer-${recipe.id}" class="absolute inset-0 w-full h-full bg-white flex flex-col">
              <div class="flex-1 overflow-hidden flex items-center justify-center bg-slate-100" style="min-height:0;">
                <canvas id="pdf-canvas-${recipe.id}" class="max-w-full max-h-full"></canvas>
              </div>
              <div id="pdf-controls-${recipe.id}" class="w-full p-2 bg-white border-t border-primary/10 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button id="pdf-prev-${recipe.id}" class="px-3 py-1 rounded bg-white border">Prev</button>
                  <button id="pdf-next-${recipe.id}" class="px-3 py-1 rounded bg-white border">Next</button>
                  <span id="pdf-page-info-${recipe.id}" class="text-sm text-slate-600 ml-2"></span>
                </div>
                <div class="flex items-center gap-2">
                  <button id="pdf-zoom-out-${recipe.id}" class="px-2 py-1 rounded bg-white border">-</button>
                  <button id="pdf-zoom-in-${recipe.id}" class="px-2 py-1 rounded bg-white border">+</button>
                </div>
              </div>
            </div>
            <div id="pdf-thumbs-${recipe.id}" class="absolute bottom-0 left-0 right-0 flex gap-2 overflow-x-auto p-2 bg-white/80"></div>` :
          (() => { const thumb = getThumbPath(recipe.scan); return `<img class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" src="/${thumb}" srcset="/${thumb} 400w, /${recipe.scan} 1200w" sizes="(max-width:640px) 90vw, 400px" alt="Scanned handwritten recipe" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${recipe.scan}'; this.removeAttribute('srcset');" />`; })()
        }
      </div>
    </div>
    <div class="mt-8 text-center px-4">
      <p class="text-slate-500 text-sm italic font-medium">Page 42 of Ibu's Red Notebook (c. ${recipe.metadata.originalYear})</p>
    </div>
  `;
  return container;
}

function createMetadataElement(recipe) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="flex justify-between">
      <span class="font-bold">Date Scanned:</span>
      <span>${recipe.metadata.dateScanned}</span>
    </div>
    <div class="flex justify-between">
      <span class="font-bold">Original Year:</span>
      <span>${recipe.metadata.originalYear}</span>
    </div>
    <div class="flex justify-between">
      <span class="font-bold">Location:</span>
      <span>${recipe.metadata.location}</span>
    </div>
    <div class="flex justify-between">
      <span class="font-bold">Format:</span>
      <span>${recipe.metadata.format}</span>
    </div>
  `;
  return container;
}

export function renderRecipe(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  appState.activeRecipeId = recipeId;

  document.getElementById('current-recipe').textContent = recipe.title;
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-description').textContent = recipe.description;

  const contentDiv = document.getElementById('recipe-content');
  contentDiv.innerHTML = createRecipeContent(recipe);

  const scanContainer = document.getElementById('scan-container');
  scanContainer.innerHTML = '';
  scanContainer.appendChild(createScanElement(recipe));
  if (recipe.scan && recipe.scan.toLowerCase().endsWith('.pdf') && window.pdfjsLib) {
    initPdfViewer(recipe.id, `/${recipe.scan}`);
  }

  const metadataDiv = document.getElementById('metadata');
  metadataDiv.innerHTML = '';
  metadataDiv.appendChild(createMetadataElement(recipe));

  if (appState.view === 'recipes') {
    updateSidebar(filterRecipes(recipes, appState.searchQuery));
  }
}
```

- [ ] **Step 2: Create src/views/gallery.js**

```javascript
import { appState, galleryItems } from '../state.js';
import { getThumbPath } from '../utils.js';
import { showLightboxForItems } from '../components/lightbox.js';

export function renderGallery(query = '') {
  document.getElementById('current-recipe').textContent = 'Family Gallery';
  document.getElementById('recipe-title').textContent = 'Family Gallery';
  document.getElementById('recipe-description').textContent = 'A curated collection of family moments and memories.';

  const filtered = query.trim()
    ? galleryItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.caption.toLowerCase().includes(query.toLowerCase()))
    : galleryItems;

  const totalPages = Math.max(1, Math.ceil(filtered.length / appState.galleryPerPage));
  appState.galleryPage = Math.min(appState.galleryPage, totalPages);

  const start = (appState.galleryPage - 1) * appState.galleryPerPage;
  const pageItems = filtered.slice(start, start + appState.galleryPerPage);

  const contentDiv = document.getElementById('recipe-content');
  contentDiv.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';

  pageItems.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'rounded-xl overflow-hidden bg-white/80 shadow-sm border border-primary/10 hover:shadow-md transition-shadow cursor-pointer';
    const thumb = getThumbPath(item.src);
    card.innerHTML = `
      <img src="/${thumb}" srcset="/${thumb} 400w, /${item.src} 1200w" sizes="(max-width: 640px) 90vw, 400px" alt="${item.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${item.src}'; this.removeAttribute('srcset');" class="w-full h-40 object-cover" />
      <div class="p-4">
        <h3 class="font-bold text-lg text-slate-900">${item.title}</h3>
        <p class="text-slate-700 text-sm mt-2">${item.caption}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      showLightboxForItems(filtered, start + idx);
    });
    grid.appendChild(card);
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'text-slate-500 italic';
    empty.textContent = 'No gallery items match your search.';
    contentDiv.appendChild(empty);
    return;
  }

  contentDiv.appendChild(grid);

  if (totalPages > 1) {
    const pager = document.createElement('div');
    pager.className = 'flex items-center justify-center gap-3 mt-8';

    const prev = document.createElement('button');
    prev.className = 'px-3 py-2 rounded-lg bg-white border border-primary/20 text-sm font-medium hover:bg-primary/10';
    prev.disabled = appState.galleryPage === 1;
    prev.textContent = 'Prev';
    prev.addEventListener('click', () => {
      if (appState.galleryPage > 1) {
        appState.galleryPage -= 1;
        renderGallery(query);
      }
    });

    const next = document.createElement('button');
    next.className = 'px-3 py-2 rounded-lg bg-white border border-primary/20 text-sm font-medium hover:bg-primary/10';
    next.disabled = appState.galleryPage === totalPages;
    next.textContent = 'Next';
    next.addEventListener('click', () => {
      if (appState.galleryPage < totalPages) {
        appState.galleryPage += 1;
        renderGallery(query);
      }
    });

    const pageInfo = document.createElement('span');
    pageInfo.className = 'text-sm text-slate-600';
    pageInfo.textContent = `Page ${appState.galleryPage} of ${totalPages}`;

    pager.appendChild(prev);
    pager.appendChild(pageInfo);
    pager.appendChild(next);

    contentDiv.appendChild(pager);
  }
}
```

- [ ] **Step 3: Create src/views/notes.js**

```javascript
import { appState, recipes } from '../state.js';
import { getThumbPath } from '../utils.js';
import { openModal, closeModal } from '../components/lightbox.js';

function openNotesModal(recipe) {
  const contentHtml = `
    <div class="relative bg-white rounded-xl overflow-hidden shadow-lg">
      <div class="flex items-center justify-between p-4 border-b border-primary/10">
        <div>
          <h3 class="font-bold text-lg text-slate-900">${recipe.title}</h3>
          <p class="text-slate-600 text-sm">${recipe.description}</p>
        </div>
        <button id="lightbox-close-btn" class="px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:bg-primary/90">Close</button>
      </div>
      <div class="p-4">
        <div class="aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden mb-4">
          ${recipe.scan.endsWith('.pdf')
            ? `<embed src="/${recipe.scan}" type="application/pdf" class="w-full h-full object-cover" />`
            : (() => { const thumb = getThumbPath(recipe.scan); return `<img src="/${thumb}" srcset="/${thumb} 800w, /${recipe.scan} 1600w" sizes="(max-width:640px) 90vw, 800px" alt="${recipe.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${recipe.scan}'; this.removeAttribute('srcset');" class="w-full h-full object-cover" />`; })()}
        </div>
        <div class="flex flex-col gap-2">
          <button id="ocr-run" class="px-4 py-2 rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90">Extract text (OCR)</button>
          <textarea id="ocr-output" class="w-full h-40 p-3 border border-primary/20 rounded-lg bg-slate-50 text-sm text-slate-700" readonly placeholder="OCR results will appear here..."></textarea>
        </div>
      </div>
    </div>
  `;

  openModal(contentHtml);
  document.getElementById('lightbox-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('ocr-run')?.addEventListener('click', async () => {
    const output = document.getElementById('ocr-output');
    const scanSrc = `/${recipe.scan}`;

    if (recipe.scan.endsWith('.pdf')) {
      output.value = 'OCR is not available for PDF previews.';
      return;
    }

    if (!window.Tesseract) {
      output.value = 'Tesseract is not loaded.';
      return;
    }

    output.value = 'Recognizing text… This can take 10–30 seconds.';
    try {
      const result = await Tesseract.recognize(scanSrc, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            output.value = `Recognizing text… ${Math.round(m.progress * 100)}%`;
          }
        }
      });
      output.value = result.data.text.trim() || 'No text recognized.';
    } catch (err) {
      console.error(err);
      output.value = 'OCR failed.';
    }
  });
}

export function renderNotes(query = '') {
  document.getElementById('current-recipe').textContent = 'Handwritten Notes';
  document.getElementById('recipe-title').textContent = 'Handwritten Notes';
  document.getElementById('recipe-description').textContent = 'Browse the original recipes as scanned pages.';

  const filtered = query.trim()
    ? recipes.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase()))
    : recipes;

  const contentDiv = document.getElementById('recipe-content');
  contentDiv.innerHTML = '';

  const scroller = document.createElement('div');
  scroller.className = 'flex gap-6 overflow-x-auto py-4 px-1 snap-x snap-mandatory';

  filtered.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'min-w-[260px] flex-shrink-0 snap-start rounded-xl overflow-hidden bg-white/80 shadow-sm border border-primary/10 hover:shadow-md transition-shadow cursor-pointer';
    card.innerHTML = `
      <div class="relative h-40 bg-slate-100">
        ${recipe.scan.endsWith('.pdf')
          ? `<embed src="/${recipe.scan}" type="application/pdf" class="w-full h-full object-cover" />`
          : (() => { const thumb = getThumbPath(recipe.scan); return `<img src="/${thumb}" srcset="/${thumb} 400w, /${recipe.scan} 1200w" sizes="(max-width:640px) 90vw, 400px" alt="Scan ${recipe.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${recipe.scan}'; this.removeAttribute('srcset');" class="w-full h-full object-cover" />`; })()}
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent px-3 py-2">
          <p class="text-sm text-white font-semibold">${recipe.title}</p>
        </div>
      </div>
      <div class="p-4">
        <p class="text-slate-700 text-sm mb-3">${recipe.description}</p>
        <button class="w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">Open notes</button>
      </div>
    `;
    card.addEventListener('click', () => openNotesModal(recipe));
    scroller.appendChild(card);
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'text-slate-500 italic';
    empty.textContent = 'No notes match your search.';
    contentDiv.appendChild(empty);
    return;
  }

  contentDiv.appendChild(scroller);
}
```

- [ ] **Step 4: Create src/views/admin.js**

```javascript
import { appState } from '../state.js';
import { openModal, closeModal } from '../components/lightbox.js';

function apiRequest(method, path, body = null, isForm = false) {
  const headers = {};
  const token = sessionStorage.getItem('admin_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) {
    if (isForm) opts.body = body;
    else { headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  }
  return fetch(path, opts).then(async res => {
    const txt = await res.text();
    try { const json = txt ? JSON.parse(txt) : null; if (!res.ok) throw json || { error: 'request failed' }; return json; } catch (e) { if (res.ok) return txt; throw e; }
  });
}

function showAdminVerifyModal(onSuccess) {
  const html = `
    <div class="p-6 bg-white rounded-xl">
      <h3 class="font-bold text-lg mb-3">Admin verification</h3>
      <p class="text-sm text-slate-600 mb-4">Enter admin code to continue.</p>
      <input id="admin-code-input" type="password" class="w-full p-2 border rounded mb-4" placeholder="Admin code" />
      <div class="flex gap-2 justify-end">
        <button id="admin-verify-cancel" class="px-4 py-2 rounded bg-white border">Cancel</button>
        <button id="admin-verify-submit" class="px-4 py-2 rounded bg-primary text-white">Verify</button>
      </div>
    </div>
  `;
  openModal(html);
  document.getElementById('admin-verify-cancel')?.addEventListener('click', closeModal);
  document.getElementById('admin-verify-submit')?.addEventListener('click', async () => {
    const code = document.getElementById('admin-code-input').value;
    if (!code) return alert('Please enter admin code');
    try {
      const res = await fetch('/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
      const json = await res.json();
      if (!res.ok) throw json;
      sessionStorage.setItem('admin_token', json.token);
      closeModal();
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      alert('Verification failed');
    }
  });
}

export function renderAdmin() {
  document.getElementById('current-recipe').textContent = 'Admin';
  document.getElementById('recipe-title').textContent = 'Admin Panel';
  document.getElementById('recipe-description').textContent = 'Manage recipes: create, edit, delete.';
  renderAdminList();
}

async function renderAdminList() {
  const contentDiv = document.getElementById('recipe-content');
  contentDiv.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-4';
  header.innerHTML = `<h3 class="font-bold">Recipes</h3>`;
  const createBtn = document.createElement('button');
  createBtn.className = 'px-4 py-2 rounded bg-primary text-white';
  createBtn.textContent = 'Create Recipe';
  createBtn.addEventListener('click', () => renderAdminForm(null));
  header.appendChild(createBtn);
  contentDiv.appendChild(header);

  let list;
  try { list = await apiRequest('GET', '/api/recipes'); } catch (e) { contentDiv.appendChild(document.createTextNode('Failed to load recipes')); return; }

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
  list.forEach(r => {
    const card = document.createElement('div');
    card.className = 'p-4 bg-white rounded-lg border flex items-center gap-4';
    card.innerHTML = `
      <div class="w-24 h-20 bg-slate-100 flex items-center justify-center overflow-hidden rounded">${r.scanThumb ? `<img src="/${r.scanThumb}" class="w-full h-full object-cover" />` : '<span class="text-xs text-slate-500">No image</span>'}</div>
      <div class="flex-1">
        <div class="font-bold">${r.title}</div>
        <div class="text-sm text-slate-600">${r.category || ''}</div>
      </div>
      <div class="flex flex-col gap-2">
        <button class="px-3 py-1 rounded bg-white border edit-btn" data-id="${r.id}">Edit</button>
        <button class="px-3 py-1 rounded bg-red-600 text-white delete-btn" data-id="${r.id}">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
  contentDiv.appendChild(grid);

  contentDiv.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');
    try { const recipe = await apiRequest('GET', `/api/recipes/${id}`); renderAdminForm(recipe); } catch (err) { alert('Failed to load recipe'); }
  }));
  contentDiv.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');
    if (!confirm('Delete this recipe?')) return;
    const token = sessionStorage.getItem('admin_token');
    const proceed = async () => {
      try { await apiRequest('DELETE', `/api/recipes/${id}`); alert('Deleted'); renderAdminList(); } catch (err) { alert('Delete failed'); }
    };
    if (!token) showAdminVerifyModal(proceed); else proceed();
  }));
}

function renderAdminForm(recipe = null) {
  const isEdit = !!recipe;
  const contentDiv = document.getElementById('recipe-content');
  contentDiv.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
  form.innerHTML = `
    <div>
      <label class="block mb-2">Title <input id="admin-title" class="w-full p-2 border rounded" value="${isEdit ? recipe.title.replace(/"/g,'&quot;') : ''}" /></label>
      <label class="block mb-2">Category <input id="admin-category" class="w-full p-2 border rounded" value="${isEdit ? (recipe.category||'') : ''}" /></label>
      <label class="block mb-2">Scan file <input id="admin-scan" type="file" accept=".pdf,image/*" class="w-full p-2" /></label>
      <label class="block mb-2">Markdown content <textarea id="admin-md" class="w-full p-2 border rounded" rows="8">${isEdit ? (recipe.md||'') : ''}</textarea></label>
    </div>
    <div>
      <label class="block mb-2">Description <textarea id="admin-description" class="w-full p-2 border rounded" rows="4">${isEdit ? (recipe.description||'') : ''}</textarea></label>
      <label class="block mb-2">Metadata (JSON) <textarea id="admin-metadata" class="w-full p-2 border rounded" rows="4">${isEdit ? JSON.stringify(recipe.metadata||{}) : '{}'}</textarea></label>
      <div class="flex gap-2 mt-4">
        <button type="submit" class="px-4 py-2 rounded bg-primary text-white">${isEdit ? 'Update' : 'Create'}</button>
        <button type="button" id="admin-cancel" class="px-4 py-2 rounded bg-white border">Cancel</button>
      </div>
    </div>
  `;
  contentDiv.appendChild(form);

  document.getElementById('admin-cancel').addEventListener('click', () => renderAdminList());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('admin-title').value.trim();
    const errorElId = 'admin-form-error';
    let errorEl = document.getElementById(errorElId);
    if (!errorEl) { errorEl = document.createElement('div'); errorEl.id = errorElId; errorEl.className = 'text-sm text-red-600 mb-2'; form.prepend(errorEl); }
    errorEl.textContent = '';

    if (!title || title.length < 3) { errorEl.textContent = 'Title is required (min 3 chars)'; return; }
    const category = document.getElementById('admin-category').value.trim();
    const description = document.getElementById('admin-description').value.trim();
    const md = document.getElementById('admin-md').value;
    let metadata = {};
    try { metadata = JSON.parse(document.getElementById('admin-metadata').value || '{}'); } catch (err) { errorEl.textContent = 'Invalid metadata JSON'; return; }

    const fileInput = document.getElementById('admin-scan');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('md', md);
    formData.append('metadata', JSON.stringify(metadata));

    if (fileInput.files && fileInput.files[0]) {
      const f = fileInput.files[0];
      const allowed = ['application/pdf','image/png','image/jpeg','image/webp'];
      if (!allowed.includes(f.type)) { errorEl.textContent = 'Invalid file type'; return; }
      if (f.size > 50 * 1024 * 1024) { errorEl.textContent = 'File too large (max 50MB)'; return; }
      formData.append('scan', f);
    }

    const token = sessionStorage.getItem('admin_token');
    const doSend = () => {
      const xhr = new XMLHttpRequest();
      const url = isEdit ? `/api/recipes/${recipe.id}` : '/api/recipes';
      xhr.open(isEdit ? 'PUT' : 'POST', url);
      if (sessionStorage.getItem('admin_token')) xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('admin_token')}`);
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || '{}');
          if (xhr.status >= 200 && xhr.status < 300) { alert(isEdit ? 'Updated' : 'Created'); renderAdminList(); }
        } catch (e) { alert('Server responded'); }
      };
      xhr.onerror = () => { alert('Network error'); };
      xhr.send(formData);
    };

    if (!token) showAdminVerifyModal(doSend); else doSend();
  });
}
```

- [ ] **Step 5: Commit**

```bash
git add src/views/
git commit -m "feat: extract view modules (recipe, gallery, notes, admin)"
```

---

## Task 6: New Entry Point (main.js)

**Files:**
- Modify: `src/main.js` (complete rewrite)

**Interfaces:**
- Consumes: All modules from Tasks 3-5
- Produces: App initialization, event wiring

- [ ] **Step 1: Rewrite src/main.js**

```javascript
import { appState, recipes } from './state.js';
import { filterRecipes } from './utils.js';
import { setView, updateSidebar } from './components/sidebar.js';
import { renderRecipe } from './views/recipe.js';
import { renderGallery } from './views/gallery.js';
import { renderNotes } from './views/notes.js';
import { renderAdmin } from './views/admin.js';
import { closeModal } from './components/lightbox.js';
import { openSidebar, closeSidebar } from './components/sidebar.js';

// Re-export for backward compatibility
export function setView(view) {
  appState.view = view;
  document.querySelectorAll('[data-view]').forEach(btn => {
    const isActive = btn.getAttribute('data-view') === view;
    btn.classList.toggle('bg-primary/10', isActive);
    btn.classList.toggle('text-primary', isActive);
    btn.classList.toggle('text-slate-600', !isActive);
    btn.classList.toggle('font-bold', isActive);
  });

  const categoriesDiv = document.getElementById('categories');
  const scanPanel = document.getElementById('scan-panel');

  if (view === 'recipes') {
    categoriesDiv.classList.remove('hidden');
    scanPanel.classList.remove('hidden');
    updateSidebar(filterRecipes(recipes, appState.searchQuery));
    renderRecipe(appState.activeRecipeId);
  } else {
    categoriesDiv.classList.add('hidden');
    scanPanel.classList.add('hidden');

    if (view === 'gallery') {
      renderGallery(appState.searchQuery);
    } else if (view === 'notes') {
      renderNotes(appState.searchQuery);
    } else if (view === 'admin') {
      renderAdmin();
    }
  }
}

function mountApp() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value;
    setView(appState.view);
  });

  const sidebarToggle = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');

  sidebarToggle.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const isHidden = sidebar.classList.contains('-translate-x-full');
    if (isHidden) openSidebar();
    else closeSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeModal();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeModal);
  }

  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      setView(view);
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    });
  });

  setView('recipes');
}

window.addEventListener('DOMContentLoaded', mountApp);
```

- [ ] **Step 2: Update index.html script tag**

```html
<!-- REMOVE this line -->
<script type="module" src="src/main.js"></script>

<!-- ADD this line (Vite will handle HMR) -->
<script type="module" src="/src/main.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add src/main.js index.html
git commit -m "feat: new modular entry point with imports"
```

---

## Task 7: Delete Unused Files

**Files:**
- Delete: `src/pages/index.html`
- Delete: `src/styles.css` (moved to src/styles/main.css)
- Delete: `src/input.css` (replaced by src/styles/main.css)

- [ ] **Step 1: Remove unused files**

```bash
rm src/pages/index.html
rm src/styles.css
rm src/input.css
rmdir src/pages
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove unused files and directories"
```

---

## Task 8: Verify Build & Dev Server

- [ ] **Step 1: Run Vite dev server**

```bash
npm run dev
```

Expected: Server starts, page loads at http://localhost:5173 with correct styles

- [ ] **Step 2: Test recipe navigation**

Click different recipes in sidebar → Content updates correctly

- [ ] **Step 3: Test gallery view**

Click "Family Gallery" → Grid of images loads

- [ ] **Step 4: Test search**

Type in search bar → Sidebar filters correctly

- [ ] **Step 5: Build for production**

```bash
npm run build
```

Expected: `dist/` folder created with minified assets

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: P1 complete - modular architecture + build system"
```

---

## Summary

After completing all tasks:
- `main.js` reduced from 1269 lines to ~100 lines
- 10 focused modules with clear responsibilities
- Local Tailwind CSS build (no more CDN)
- Vite dev server with HMR + production build
- Proper ES module imports/exports
- Deleted unused files (header.js, pages/index.html, duplicate CSS)
