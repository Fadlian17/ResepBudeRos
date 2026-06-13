const recipes = [
  {
    id: 'sayur-asem',
    title: 'Ibu\'s Sayur Asem',
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

const galleryItems = [
  {
    id: 'family-1',
    title: 'Family Moment',
    src: 'public/gallery/family-1.svg',
    caption: 'A warm day in the kitchen with grandma.',
  },
  {
    id: 'family-2',
    title: 'Grandma\'s Kitchen',
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

const appState = {
  view: 'recipes', // 'recipes' | 'gallery' | 'notes'
  activeRecipeId: 'sayur-asem',
  searchQuery: '',
  galleryPage: 1,
  galleryPerPage: 6
};

function renderMarkdown(md) {
  return marked.parse(md);
}

// Simple filter helper used by the sidebar and views
function filterRecipes(query = '') {
  const q = (query || '').trim().toLowerCase();
  if (!q) return recipes;
  return recipes.filter(r => {
    return r.id.toLowerCase().includes(q)
      || r.title.toLowerCase().includes(q)
      || (r.description || '').toLowerCase().includes(q)
      || (r.category || '').toLowerCase().includes(q);
  });
}

// Compute a thumbnail path for an asset. Expects assets under `public/gallery/` or `public/scans/`.
function getThumbPath(path) {
  try {
    // replace e.g. 'public/gallery/name.jpg' -> 'public/gallery/thumbs/name.webp'
    return path.replace(/^public\/(gallery|scans)\//, 'public/$1/thumbs/').replace(/\.[^.]+$/, '.webp');
  } catch (e) {
    return path;
  }
}

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
          <div class="h-2 w-full bg-slate-900/5 rounded-full opacity-50"></div>
          <div class="space-y-2 pl-4">
            <div class="h-2 w-5/6 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-3/4 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-4/5 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-2/3 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-5/6 bg-slate-900/5 rounded-full opacity-30"></div>
          </div>
        </div>
        ${recipe.scan.endsWith('.pdf') ? 
          `<embed class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" src="/${recipe.scan}" type="application/pdf" />` :
          (() => { const thumb = getThumbPath(recipe.scan); return `<img class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" src="/${thumb}" srcset="/${thumb} 800w, /${recipe.scan} 1600w" sizes="(max-width:640px) 90vw, 600px" alt="Scanned handwritten recipe" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${recipe.scan}'; this.removeAttribute('srcset');" />`; })()
        }
      </div>
    </div>
    <div class="mt-8 text-center px-4">
      <p class="text-slate-500 text-sm italic font-medium">Page 42 of Ibu's Red Notebook (c. ${recipe.metadata.originalYear})</p>
      <div class="mt-4 flex justify-center gap-4">
        <button class="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">zoom_in</span>
        </button>
        <button class="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">download</span>
        </button>
        <button class="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">print</span>
        </button>
      </div>
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

function openModal(contentHtml) {
  const overlay = document.getElementById('lightbox-overlay');
  const content = document.getElementById('lightbox-content');
  // save previously focused element
  appState._previouslyFocusedElement = document.activeElement;
  content.innerHTML = contentHtml;
  overlay.classList.remove('hidden');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  // move focus into the modal
  setTimeout(() => {
    const focusable = overlay.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable && focusable.length ? focusable[0] : overlay;
    first.focus();
  }, 10);

  // key handlers for Esc, arrows, and Tab focus trap
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

function closeModal() {
  const overlay = document.getElementById('lightbox-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');

  // clear content
  const content = document.getElementById('lightbox-content');
  content.innerHTML = '';

  // remove key handler
  if (appState._modalKeyHandler) {
    document.removeEventListener('keydown', appState._modalKeyHandler);
    appState._modalKeyHandler = null;
  }

  // restore focus
  try {
    if (appState._previouslyFocusedElement && typeof appState._previouslyFocusedElement.focus === 'function') {
      appState._previouslyFocusedElement.focus();
    }
  } catch (e) {}
  appState._previouslyFocusedElement = null;
}

function showLightboxForItems(items, startIndex = 0) {
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

    // Zoom / pan / pinch handlers for image
    const imgEl = document.getElementById('lightbox-img');
    if (imgEl) {
      // reset transform state
      imgEl.dataset.scale = '1';
      imgEl.dataset.translateX = '0';
      imgEl.dataset.translateY = '0';
      const setTransform = () => {
        const s = parseFloat(imgEl.dataset.scale || '1');
        const tx = parseFloat(imgEl.dataset.translateX || '0');
        const ty = parseFloat(imgEl.dataset.translateY || '0');
        imgEl.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      };

      // wheel to zoom
      imgEl.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const delta = ev.deltaY > 0 ? -0.1 : 0.1;
        let s = parseFloat(imgEl.dataset.scale || '1');
        s = Math.min(4, Math.max(0.5, s + delta));
        imgEl.dataset.scale = s.toString();
        setTransform();
      }, { passive: false });

      // zoom buttons
      document.getElementById('lightbox-zoom-in')?.addEventListener('click', () => {
        let s = parseFloat(imgEl.dataset.scale || '1'); s = Math.min(4, s + 0.25); imgEl.dataset.scale = s; setTransform();
      });
      document.getElementById('lightbox-zoom-out')?.addEventListener('click', () => {
        let s = parseFloat(imgEl.dataset.scale || '1'); s = Math.max(0.5, s - 0.25); imgEl.dataset.scale = s; setTransform();
      });
      document.getElementById('lightbox-zoom-fit')?.addEventListener('click', () => {
        imgEl.dataset.scale = '1'; imgEl.dataset.translateX = '0'; imgEl.dataset.translateY = '0'; setTransform();
      });

      // basic pan when dragged (pointer events)
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

      // pinch-zoom: track multiple pointers
      const pointers = new Map();
      let lastDist = null;
      imgEl.addEventListener('pointerdown', (e) => { pointers.set(e.pointerId, e); });
      imgEl.addEventListener('pointerup', (e) => { pointers.delete(e.pointerId); lastDist = null; });
      imgEl.addEventListener('pointercancel', (e) => { pointers.delete(e.pointerId); lastDist = null; });
      imgEl.addEventListener('pointermove', (e) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, e);
        if (pointers.size === 2) {
          const pts = Array.from(pointers.values());
          const dx = pts[0].clientX - pts[1].clientX;
          const dy = pts[0].clientY - pts[1].clientY;
          const dist = Math.hypot(dx, dy);
          if (lastDist != null) {
            const delta = (dist - lastDist) / 200; // sensitivity
            let s = parseFloat(imgEl.dataset.scale || '1');
            s = Math.min(4, Math.max(0.5, s + delta));
            imgEl.dataset.scale = s.toString();
            setTransform();
          }
          lastDist = dist;
        }
      });
    }
  }

  renderLightbox();
}

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
      output.value = 'OCR is not available for PDF previews. Convert a page to an image or place a text file at `/public/ocr/${recipe.id}.txt`.';
      return;
    }

    if (!window.Tesseract) {
      output.value = 'Tesseract is not loaded. Please ensure tesseract.js is included in the page to use OCR.';
      return;
    }

    output.value = 'Recognizing text… This can take 10–30 seconds for a scanned page.';
    try {
      const result = await Tesseract.recognize(scanSrc, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            output.value = `Recognizing text… ${Math.round(m.progress * 100)}%`;
          }
        }
      });
      output.value = result.data.text.trim() || 'No text recognized (try a clearer scan or provide a pre-extracted text file at /ocr/${recipe.id}.txt).';
    } catch (err) {
      console.error(err);
      output.value = 'OCR failed. You can provide a pre-extracted text file at `/public/ocr/${recipe.id}.txt`.';
    }
  });
}

function setActiveViewButton(view) {
  document.querySelectorAll('[data-view]').forEach(btn => {
    const isActive = btn.getAttribute('data-view') === view;
    btn.classList.toggle('bg-primary/10', isActive);
    btn.classList.toggle('text-primary', isActive);
    btn.classList.toggle('text-slate-600', !isActive);
    btn.classList.toggle('font-bold', isActive);
  });
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('-translate-x-full');
  overlay.classList.remove('hidden');
}

function renderRecipe(recipeId) {
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

  const metadataDiv = document.getElementById('metadata');
  metadataDiv.innerHTML = '';
  metadataDiv.appendChild(createMetadataElement(recipe));

  // Keep sidebar highlighting in sync
  if (appState.view === 'recipes') {
    updateSidebar(filterRecipes(appState.searchQuery));
  }
}

function renderGallery(query = '') {
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

function renderNotes(query = '') {
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

function updateSidebar(filteredRecipes) {
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

function setView(view) {
  appState.view = view;
  setActiveViewButton(view);

  const categoriesDiv = document.getElementById('categories');
  const scanPanel = document.getElementById('scan-panel');

  if (view === 'recipes') {
    categoriesDiv.classList.remove('hidden');
    scanPanel.classList.remove('hidden');
    updateSidebar(filterRecipes(appState.searchQuery));
    renderRecipe(appState.activeRecipeId);
  } else {
    categoriesDiv.classList.add('hidden');
    scanPanel.classList.add('hidden');

    if (view === 'gallery') {
      renderGallery(appState.searchQuery);
    } else if (view === 'notes') {
      renderNotes(appState.searchQuery);
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

  // Initialize
  setView('recipes');
}

window.addEventListener('DOMContentLoaded', mountApp);
