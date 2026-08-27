import { appState } from '../state.js';
import { filterRecipes } from '../utils.js';
import { recipes } from '../state.js';

let _renderRecipe = null;
let _setView = null;

export function setRenderRecipe(fn) { _renderRecipe = fn; }
export function setView(fn) { _setView = fn; }

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

  document.querySelectorAll('.recipe-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const recipeId = e.target.getAttribute('data-recipe');
      if (_setView) _setView('recipes');
      if (_renderRecipe) _renderRecipe(recipeId);
      if (window.innerWidth < 768) closeSidebar();
    });
  });
}
