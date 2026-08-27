import { recipes, galleryItems, appState } from './state.js';
import { filterRecipes, getThumbPath } from './utils.js';
import { setActiveViewButton, closeSidebar, openSidebar, updateSidebar, setRenderRecipe, setView as setSidebarView } from './components/sidebar.js';
import { openModal, closeModal, showLightboxForItems } from './components/lightbox.js';
import { initPdfViewer } from './components/pdf-viewer.js';

function renderMarkdown(md) {
  return marked.parse(md);
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
          // PDF viewer placeholder: canvas + thumbnails will be initialized by initPdfViewer
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
  // If PDF, initialize the PDF.js viewer for this recipe
  if (recipe.scan && recipe.scan.toLowerCase().endsWith('.pdf') && window.pdfjsLib) {
    initPdfViewer(recipe.id, `/${recipe.scan}`);
  }

  const metadataDiv = document.getElementById('metadata');
  metadataDiv.innerHTML = '';
  metadataDiv.appendChild(createMetadataElement(recipe));

  // Keep sidebar highlighting in sync
  if (appState.view === 'recipes') {
    updateSidebar(filterRecipes(recipes, appState.searchQuery));
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

/* ------------------ Admin UI & API helpers ------------------ */

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

function renderAdmin() {
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

  // attach listeners
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
    // inline validation and UI feedback
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

    // create UI elements: preview & progress & response
    let previewWrap = document.getElementById('admin-upload-preview');
    if (!previewWrap) { previewWrap = document.createElement('div'); previewWrap.id = 'admin-upload-preview'; previewWrap.className = 'mt-3 mb-2'; form.appendChild(previewWrap); }
    let progressWrap = document.getElementById('admin-upload-progress');
    if (!progressWrap) { progressWrap = document.createElement('div'); progressWrap.id = 'admin-upload-progress'; progressWrap.className = 'w-full bg-slate-100 rounded overflow-hidden mt-2 hidden'; progressWrap.innerHTML = '<div id="admin-upload-bar" class="h-2 bg-primary" style="width:0%"></div>'; form.appendChild(progressWrap); }
    let respWrap = document.getElementById('admin-server-response');
    if (!respWrap) { respWrap = document.createElement('pre'); respWrap.id = 'admin-server-response'; respWrap.className = 'mt-3 text-sm bg-white p-2 rounded border text-slate-700'; form.appendChild(respWrap); }
    respWrap.textContent = '';

    // preview file before submit (if an image)
    if (fileInput.files && fileInput.files[0]) {
      const f = fileInput.files[0];
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => { previewWrap.innerHTML = `<img src="${ev.target.result}" class="max-w-full max-h-48 rounded border" />`; };
        reader.readAsDataURL(f);
      } else {
        previewWrap.innerHTML = `<div class="text-sm text-slate-600">Selected file: ${f.name}</div>`;
      }
    } else {
      previewWrap.innerHTML = '';
    }

    const token = sessionStorage.getItem('admin_token');
    const doSend = () => {
      const xhr = new XMLHttpRequest();
      const url = isEdit ? `/api/recipes/${recipe.id}` : '/api/recipes';
      xhr.open(isEdit ? 'PUT' : 'POST', url);
      if (sessionStorage.getItem('admin_token')) xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('admin_token')}`);
      progressWrap.classList.remove('hidden');
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          document.getElementById('admin-upload-bar').style.width = `${pct}%`;
        }
      };
      xhr.onload = () => {
        progressWrap.classList.add('hidden');
        try {
          const json = JSON.parse(xhr.responseText || '{}');
          respWrap.textContent = JSON.stringify(json, null, 2);
          if (xhr.status >= 200 && xhr.status < 300) { alert(isEdit ? 'Updated' : 'Created'); renderAdminList(); }
        } catch (e) { respWrap.textContent = xhr.responseText; alert('Server responded'); }
      };
      xhr.onerror = () => { progressWrap.classList.add('hidden'); respWrap.textContent = 'Network error'; };
      xhr.send(formData);
    };

    if (!token) showAdminVerifyModal(doSend); else doSend();
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
  setRenderRecipe(renderRecipe);
  setSidebarView(setView);

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
