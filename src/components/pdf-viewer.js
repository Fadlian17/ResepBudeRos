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

    if (thumbsContainer) {
      thumbsContainer.innerHTML = '';
      const spinner = document.createElement('div');
      spinner.className = 'w-full flex items-center justify-center p-6';
      spinner.innerHTML = '<svg class="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.2" stroke-width="4"></circle><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path></svg>';
      thumbsContainer.appendChild(spinner);

      for (let p = 1; p <= pdfDoc.numPages; p++) {
        try {
          const thumbKey = `${recipeId}-thumb-${p}`;
          const cached = await idbGet('pdf-thumbs', thumbKey);
          if (cached) {
            const img = document.createElement('img');
            img.src = cached;
            img.className = 'rounded border p-1 bg-white flex-none';
            img.style.height = '64px';
            img.style.display = 'block';
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

      if (spinner && spinner.parentNode) spinner.parentNode.removeChild(spinner);
    }
  } catch (err) {
    console.error('PDF viewer init failed', err);
  }
}
