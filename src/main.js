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
      location: 'East Jakarta,  Jakarta',
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
      location: 'East Jakarta,  Jakarta',
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
      location: 'East Jakarta,  Jakarta',
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
      location: 'East Jakarta,  Jakarta',
      format: 'Hardbound Notebook'
    }
  }
];

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
          `<embed class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" src="/${recipe.scan}" type="application/pdf" />` :
          `<img class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" src="/${recipe.scan}" alt="Scanned handwritten recipe" />`
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

async function loadRecipe(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  // Update title and description
  document.getElementById('current-recipe').textContent = recipe.title;
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-description').textContent = recipe.description;

  // Load content
  const contentDiv = document.getElementById('recipe-content');
  contentDiv.innerHTML = createRecipeContent(recipe);

  // Load scan
  const scanContainer = document.getElementById('scan-container');
  scanContainer.innerHTML = '';
  scanContainer.appendChild(createScanElement(recipe));

  // Load metadata
  const metadataDiv = document.getElementById('metadata');
  metadataDiv.innerHTML = '';
  metadataDiv.appendChild(createMetadataElement(recipe));
}

function filterRecipes(query) {
  if (!query.trim()) {
    return recipes; // Return all if no query
  }
  const lowerQuery = query.toLowerCase();
  return recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(lowerQuery) ||
    recipe.category.toLowerCase().includes(lowerQuery) ||
    recipe.id.toLowerCase().includes(lowerQuery)
  );
}

function updateSidebar(filteredRecipes) {
  const categoriesDiv = document.getElementById('categories');
  categoriesDiv.innerHTML = '';

  // Group by category
  const grouped = {};
  filteredRecipes.forEach(recipe => {
    if (!grouped[recipe.category]) {
      grouped[recipe.category] = [];
    }
    grouped[recipe.category].push(recipe);
  });

  // Render categories
  Object.keys(grouped).forEach(category => {
    const categoryDiv = document.createElement('div');
    const icon = category === 'Soups' ? 'restaurant' : category === 'Main Dishes' ? 'skillet' : 'icecream';
    const isActive = grouped[category].some(r => r.id === 'sayur-asem'); // Example active check
    categoryDiv.innerHTML = `
      <div class="flex items-center gap-2 px-3 py-1 mb-1">
        <span class="material-symbols-outlined text-${isActive ? 'primary' : 'slate-400'} text-sm">${icon}</span>
        <span class="text-${isActive ? 'slate-900' : 'slate-600'} font-bold text-sm">${category}</span>
      </div>
      <div class="ml-6 space-y-1">
        ${grouped[category].map(recipe => `
          <a class="block px-3 py-2 rounded-lg ${recipe.id === 'sayur-asem' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-600 hover:text-primary transition-colors'} text-sm font-medium recipe-link" href="#" data-recipe="${recipe.id}">${recipe.title}</a>
        `).join('')}
      </div>
    `;
    categoriesDiv.appendChild(categoryDiv);
  });

  // Re-attach event listeners
  document.querySelectorAll('.recipe-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const recipeId = e.target.getAttribute('data-recipe');
      loadRecipe(recipeId);
      // Close sidebar on mobile after selecting recipe
      if (window.innerWidth < 768) {
        toggleSidebar(false);
      }
    });
  });
}

function mountApp() {
  // Search functionality
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const filtered = filterRecipes(query);
    updateSidebar(filtered);
  });

  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function toggleSidebar(show) {
    if (show) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }
  }

  sidebarToggle.addEventListener('click', () => {
    const isHidden = sidebar.classList.contains('-translate-x-full');
    toggleSidebar(isHidden);
  });

  overlay.addEventListener('click', () => {
    toggleSidebar(false);
  });

  // Load default recipe and sidebar
  loadRecipe('sayur-asem');
  updateSidebar(recipes);
}

window.addEventListener('DOMContentLoaded', mountApp);
