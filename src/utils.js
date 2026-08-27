export function filterRecipes(recipes, query = '') {
  const q = (query || '').trim().toLowerCase();
  if (!q) return recipes;
  return recipes.filter(r => {
    return r.id.toLowerCase().includes(q)
      || r.title.toLowerCase().includes(q)
      || (r.description || '').toLowerCase().includes(q)
      || (r.category || '').toLowerCase().includes(q);
  });
}

export function getThumbPath(path) {
  try {
    return path.replace(/^public\/(gallery|scans)\//, 'public/$1/thumbs/').replace(/\.[^.]+$/, '.webp');
  } catch (e) {
    return path;
  }
}

// IndexedDB helpers for caching
export function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('resep-cache', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pdf-thumbs')) db.createObjectStore('pdf-thumbs');
      if (!db.objectStoreNames.contains('pdf-pages')) db.createObjectStore('pdf-pages');
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function idbGet(store, key) {
  try {
    const db = await openIDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const r = os.get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  } catch (e) {
    return null;
  }
}

export async function idbPut(store, key, value) {
  try {
    const db = await openIDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      const r = os.put(value, key);
      r.onsuccess = () => resolve(true);
      r.onerror = () => reject(r.error);
    });
  } catch (e) {
    return false;
  }
}
