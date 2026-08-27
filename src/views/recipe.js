import { appState, recipes } from '../state.js';
import { getThumbPath, filterRecipes } from '../utils.js';
import { initPdfViewer } from '../components/pdf-viewer.js';
import { updateSidebar } from '../components/sidebar.js';

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
