export function createSidebar(items = []) {
  const nav = document.createElement('nav');
  nav.className = 'sidebar';
  const ul = document.createElement('ul');
  items.forEach(it => {
    const li = document.createElement('li');
    li.innerHTML = `<button data-id="${it.id}">${it.title}</button>`;
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  return nav;
}
