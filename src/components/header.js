export function createHeader(title) {
  const h = document.createElement('header');
  h.className = 'site-header';
  h.innerHTML = `<h1>${title}</h1>`;
  return h;
}
