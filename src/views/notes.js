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
