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
