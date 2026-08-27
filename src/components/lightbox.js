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

    const preloadImage = (idx) => {
      if (idx < 0 || idx >= appState.galleryItems.length) return;
      const src = appState.galleryItems[idx].src;
      if (!src || src.endsWith('.pdf')) return;
      const img = new Image();
      img.src = `/${appState.galleryItems[idx].src}`;
    };
    preloadImage(appState.lightboxIndex - 1);
    preloadImage(appState.lightboxIndex + 1);

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
            const delta = (dist - lastDist) / 200;
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
