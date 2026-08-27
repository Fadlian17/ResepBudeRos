import { openModal, closeModal } from '../components/lightbox.js';

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

export function renderAdmin() {
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

    let previewWrap = document.getElementById('admin-upload-preview');
    if (!previewWrap) { previewWrap = document.createElement('div'); previewWrap.id = 'admin-upload-preview'; previewWrap.className = 'mt-3 mb-2'; form.appendChild(previewWrap); }
    let progressWrap = document.getElementById('admin-upload-progress');
    if (!progressWrap) { progressWrap = document.createElement('div'); progressWrap.id = 'admin-upload-progress'; progressWrap.className = 'w-full bg-slate-100 rounded overflow-hidden mt-2 hidden'; progressWrap.innerHTML = '<div id="admin-upload-bar" class="h-2 bg-primary" style="width:0%"></div>'; form.appendChild(progressWrap); }
    let respWrap = document.getElementById('admin-server-response');
    if (!respWrap) { respWrap = document.createElement('pre'); respWrap.id = 'admin-server-response'; respWrap.className = 'mt-3 text-sm bg-white p-2 rounded border text-slate-700'; form.appendChild(respWrap); }
    respWrap.textContent = '';

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
