import { recipes, galleryItems, appState } from './state.js';
import { filterRecipes } from './utils.js';
import { setActiveViewButton, closeSidebar, openSidebar, updateSidebar, setRenderRecipe, setView as setSidebarView } from './components/sidebar.js';
import { closeModal } from './components/lightbox.js';
import { renderRecipe } from './views/recipe.js';
import { renderGallery } from './views/gallery.js';
import { renderNotes } from './views/notes.js';
import { renderAdmin } from './views/admin.js';

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

  setView('recipes');
}

window.addEventListener('DOMContentLoaded', mountApp);
