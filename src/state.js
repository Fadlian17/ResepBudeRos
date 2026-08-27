export const recipes = [
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

export const galleryItems = [
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

export const appState = {
  view: 'recipes',
  activeRecipeId: 'sayur-asem',
  searchQuery: '',
  galleryPage: 1,
  galleryPerPage: 6,
  pdfViewers: {},
};
