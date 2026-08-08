const grid = document.getElementById('grid');
const gridPromos = document.getElementById('gridPromos');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const themeToggle = document.getElementById('themeToggle');
const searchBtn = document.getElementById('btnBuscar');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const helpOverlay = document.getElementById('helpOverlay');
const adminOverlay = document.getElementById('adminOverlay');
const adminPass = document.getElementById('adminPass');
const adminLoginDiv = document.getElementById('adminLogin');
const adminPanel = document.getElementById('adminPanel');
const adminList = document.getElementById('adminList');
const adminMsg = document.getElementById('adminMsg');
const emptyMsg = document.getElementById('emptyMsg');

const filter = document.body.dataset.filter || 'all';
const DESCUENTO = 0.85;
const DEFAULT_PROMOS = ['Auriculares NoiseFree', 'Parlante SoundMax Mini', 'Cable USB-C Trenzado 2m'];

let lastCard = null;
let settings = { index: null, recomendaciones: null, promos: null, productos: [] };
let token = sessionStorage.getItem('adminToken') || '';

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function fmt(n) {
  return n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

function promoOf(p) {
  return Array.isArray(settings.promos) && settings.promos.includes(p.nombre);
}

function priceHtml(p) {
  if (promoOf(p)) {
    const now = Math.round(p.precio * DESCUENTO);
    return `<div class="price"><span class="old">${fmt(p.precio)}</span><span class="now">${fmt(now)}</span></div>`;
  }
  return `<div class="price">${fmt(p.precio)}</div>`;
}

function renderCard(p, container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.search = `${p.nombre} ${p.marca}`.toLowerCase();
  card.dataset.name = p.nombre;
  card.innerHTML = `
    <div class="thumb">
      <img src="${p.img}" alt="${p.nombre}">
      ${promoOf(p) ? '<span class="badge">🔥 -15%</span>' : ''}
    </div>
    <h3>${p.nombre}</h3>
    <div class="brand">${p.marca}</div>
    ${priceHtml(p)}
  `;
  card.addEventListener('click', () => openModal(p, card));
  container.appendChild(card);
}

function clearGrid(g) {
  while (g && g.firstChild) g.removeChild(g.firstChild);
}

function allProducts() {
  const base = productos.slice();
  const custom = Array.isArray(settings.productos) ? settings.productos : [];
  const seen = new Set(base.map(p => p.nombre.toLowerCase()));
  for (const p of custom) {
    if (p && p.nombre && !seen.has(p.nombre.toLowerCase())) {
      base.push(p);
      seen.add(p.nombre.toLowerCase());
    }
  }
  return base;
}

function defaultVisible() {
  const all = allProducts();
  if (filter === 'reco') {
    return Array.isArray(settings.recomendaciones)
      ? settings.recomendaciones
      : all.filter(p => p.reco).map(p => p.nombre);
  }
  return Array.isArray(settings.index) ? settings.index : all.map(p => p.nombre);
}

function applyVisibility() {
  const q = searchInput.value.trim().toLowerCase();
  const searching = q.length > 0;
  const visibleSet = new Set(defaultVisible());
  let visible = 0;
  grid.querySelectorAll('.card').forEach(card => {
    const matches = !q || card.dataset.search.includes(q);
    const inPage = searching || visibleSet.has(card.dataset.name);
    const show = matches && inPage;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  emptyMsg.hidden = visible !== 0;
}

function renderAll() {
  clearGrid(grid);
  allProducts().forEach(p => renderCard(p, grid));
  applyVisibility();
  if (gridPromos) {
    clearGrid(gridPromos);
    const names = Array.isArray(settings.promos) ? settings.promos : DEFAULT_PROMOS;
    allProducts().filter(p => names.includes(p.nombre)).forEach(p => renderCard(p, gridPromos));
  }
}

async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) settings = await res.json();
  } catch (e) {
    settings = { index: null, recomendaciones: null, promos: null, productos: [] };
  }
  if (!Array.isArray(settings.productos)) settings.productos = [];
  renderAll();
}

searchBtn.addEventListener('click', () => {
  const open = searchPanel.classList.toggle('open');
  if (open) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    applyVisibility();
  }
});

searchInput.addEventListener('input', applyVisibility);

function openHelp() { helpOverlay.classList.add('open'); }

function closeHelp() { helpOverlay.classList.remove('open'); }

helpOverlay.addEventListener('click', (e) => {
  if (e.target === helpOverlay) closeHelp();
});

function openModal(p, cardEl) {
  const specs = p.specs
    .map(s => `<li><span>${s[0]}</span><strong>${s[1]}</strong></li>`)
    .join('');
  const priceBig = promoOf(p)
    ? `<div class="price-big"><span class="old">${fmt(p.precio)}</span> <span class="now">${fmt(Math.round(p.precio * DESCUENTO))}</span></div>`
    : `<div class="price-big">${fmt(p.precio)}</div>`;
  modal.innerHTML = `
    <button class="close" onclick="closeModal()">&times;</button>
    <div class="thumb thumb-lg"><img src="${p.img}" alt="${p.nombre}"></div>
    <h2>${p.nombre}</h2>
    <div class="brand">${p.marca}</div>
    ${priceBig}
    <ul>${specs}</ul>
    <div class="buttons">
      <a href="#" class="btn btn-wa" onclick="return false;">💬 WhatsApp</a>
      <a href="#" class="btn btn-tg" onclick="return false;">✈️ Telegram</a>
    </div>
  `;

  if (document.startViewTransition) {
    const cardThumb = cardEl.querySelector('.thumb');
    lastCard = cardEl;
    cardThumb.style.viewTransitionName = 'product-img';
    document.startViewTransition(() => {
      overlay.classList.add('open');
      modal.style.animation = 'none';
      cardThumb.style.viewTransitionName = '';
    });
  } else {
    const srcRect = cardEl.getBoundingClientRect();
    overlay.classList.add('open');
    const modalRect = modal.getBoundingClientRect();
    const originX = srcRect.left + srcRect.width / 2 - modalRect.left;
    const originY = srcRect.top + srcRect.height / 2 - modalRect.top;
    modal.style.transformOrigin = `${originX}px ${originY}px`;
    modal.style.animation = 'none';
    void modal.offsetWidth;
    modal.style.animation = '';
  }
}

function closeModal() {
  if (document.startViewTransition && lastCard && overlay.classList.contains('open')) {
    const cardThumb = lastCard.querySelector('.thumb');
    const modalThumb = modal.querySelector('.thumb-lg');
    if (modalThumb) modalThumb.style.viewTransitionName = 'product-img';
    const vt = document.startViewTransition(() => {
      overlay.classList.remove('open');
      if (modalThumb) modalThumb.style.viewTransitionName = '';
      cardThumb.style.viewTransitionName = 'product-img';
    });
    vt.finished.finally(() => {
      cardThumb.style.viewTransitionName = '';
    });
  } else {
    overlay.classList.remove('open');
  }
}

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

function openAdmin() {
  adminOverlay.classList.add('open');
  adminMsg.textContent = 'Ingresa la contraseña para gestionar el catálogo.';
  adminPass.value = '';
  if (token) {
    adminLoginDiv.hidden = true;
    adminPanel.hidden = false;
    enterAdmin();
  } else {
    adminLoginDiv.hidden = false;
    adminPanel.hidden = true;
  }
}

function closeAdmin() { adminOverlay.classList.remove('open'); }

adminOverlay.addEventListener('click', (e) => {
  if (e.target === adminOverlay) closeAdmin();
});

async function adminLogin() {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPass.value })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      token = data.token;
      sessionStorage.setItem('adminToken', token);
      adminLoginDiv.hidden = true;
      adminPanel.hidden = false;
      enterAdmin();
    } else {
      adminMsg.textContent = '❌ Contraseña incorrecta.';
    }
  } catch (e) {
    adminMsg.textContent = '❌ No se pudo conectar con el servidor.';
  }
}

function enterAdmin() {
  switchTab('list');
  buildAdminList();
  buildSpecInputs();
  adminMsg.textContent = 'Sesión iniciada. Elige qué mostrar, añade productos y pulsa Guardar.';
}

function switchTab(tab) {
  const listTab = document.getElementById('adminTabList');
  const addTab = document.getElementById('adminTabAdd');
  listTab.hidden = tab !== 'list';
  addTab.hidden = tab !== 'add';
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
}

function buildSpecInputs() {
  const wrap = document.getElementById('addSpecs');
  wrap.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const row = document.createElement('div');
    row.className = 'add-spec-row';
    row.innerHTML = `
      <input class="add-spec-k" placeholder="Aspecto (ej: Pantalla)">
      <input class="add-spec-v" placeholder="Valor (ej: 6.7&quot; AMOLED)">
    `;
    wrap.appendChild(row);
  }
}

function toggleHtml(field, checked, label) {
  return `
    <label class="admin-toggle" title="${label}">
      <span class="admin-toggle-label">${label}</span>
      <span class="switch">
        <input type="checkbox" data-field="${field}" ${checked ? 'checked' : ''}>
        <span class="slider"></span>
      </span>
    </label>
  `;
}

function buildAdminList() {
  adminList.innerHTML = '';
  const promoNames = Array.isArray(settings.promos) ? settings.promos : [];
  const customNames = new Set((settings.productos || []).map(p => p.nombre));
  allProducts().forEach(p => {
    const inIdx = Array.isArray(settings.index) ? settings.index.includes(p.nombre) : true;
    const inReco = Array.isArray(settings.recomendaciones) ? settings.recomendaciones.includes(p.nombre) : false;
    const inPromo = promoNames.includes(p.nombre);
    const isCustom = customNames.has(p.nombre);
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.dataset.name = p.nombre;
    row.innerHTML = `
      <img class="admin-thumb" src="${p.img}" alt="">
      <div class="admin-info">
        <span class="admin-name">${p.nombre}</span>
        <span class="admin-brand">${p.marca} · ${fmt(p.precio)}</span>
      </div>
      <div class="admin-toggles">
        ${toggleHtml('index', inIdx, 'Inicio')}
        ${toggleHtml('reco', inReco, 'Reco')}
        ${toggleHtml('promo', inPromo, 'Promo')}
      </div>
      ${isCustom ? `<button class="admin-del" title="Eliminar producto" onclick="delProduct('${p.nombre.replace(/'/g, "\\'")}')">🗑</button>` : ''}
    `;
    adminList.appendChild(row);
  });
  adminList.querySelectorAll('input[data-field="promo"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = adminList.querySelectorAll('input[data-field="promo"]:checked');
      if (checked.length > 3) {
        cb.checked = false;
        adminMsg.textContent = '⚠️ Máximo 3 productos con promoción.';
      }
    });
  });
}

function delProduct(name) {
  settings.productos = (settings.productos || []).filter(p => p.nombre !== name);
  buildAdminList();
  adminMsg.textContent = '🗑 Producto eliminado. Pulsa Guardar cambios para guardarlo en todos los dispositivos.';
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function addProduct() {
  const nombre = document.getElementById('addNombre').value.trim();
  const marca = document.getElementById('addMarca').value.trim();
  const precio = Number(document.getElementById('addPrecio').value);

  if (!nombre || !marca || !precio || precio <= 0) {
    adminMsg.textContent = '❌ Completa nombre, marca y precio (mayor a 0).';
    return;
  }
  if (allProducts().some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
    adminMsg.textContent = '❌ Ya existe un producto con ese nombre.';
    return;
  }

  const specs = [];
  document.querySelectorAll('.add-spec-row').forEach(r => {
    const k = r.querySelector('.add-spec-k').value.trim();
    const v = r.querySelector('.add-spec-v').value.trim();
    if (k && v) specs.push([k, v]);
  });
  if (!specs.length) specs.push(['Descripción', 'Producto añadido por el administrador']);

  let img = 'img/placeholder.webp';
  const fileInput = document.getElementById('addImg');
  if (fileInput.files.length) {
    try {
      const dataUrl = await fileToDataUrl(fileInput.files[0]);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ dataUrl })
      });
      if (res.ok) {
        const d = await res.json();
        img = d.path;
      } else {
        adminMsg.textContent = '⚠️ No se pudo subir la imagen; se usará la de ejemplo.';
      }
    } catch (e) {
      adminMsg.textContent = '⚠️ Error al subir la imagen; se usará la de ejemplo.';
    }
  }

  settings.productos = settings.productos || [];
  settings.productos.push({ nombre, marca, precio, img, specs });
  buildAdminList();
  resetAddForm();
  adminMsg.textContent = '✅ Producto añadido. Pulsa Guardar cambios para que se vea en todos los dispositivos.';
}

function resetAddForm() {
  ['addNombre', 'addMarca', 'addPrecio', 'addImg'].forEach(id => {
    document.getElementById(id).value = '';
  });
  buildSpecInputs();
}

async function adminSave() {
  const indexNames = [];
  const recoNames = [];
  const promoNames = [];
  adminList.querySelectorAll('.admin-row').forEach(row => {
    if (row.querySelector('input[data-field="index"]').checked) indexNames.push(row.dataset.name);
    if (row.querySelector('input[data-field="reco"]').checked) recoNames.push(row.dataset.name);
    if (row.querySelector('input[data-field="promo"]').checked) promoNames.push(row.dataset.name);
  });
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        index: indexNames,
        recomendaciones: recoNames,
        promos: promoNames,
        productos: settings.productos || []
      })
    });
    if (res.ok) {
      settings = await res.json();
      if (!Array.isArray(settings.productos)) settings.productos = [];
      adminMsg.textContent = '✅ Cambios guardados. Ya se reflejan en todos los dispositivos.';
      renderAll();
    } else {
      adminMsg.textContent = '❌ Sesión expirada. Vuelve a iniciar sesión.';
      adminLogout();
    }
  } catch (e) {
    adminMsg.textContent = '❌ No se pudo guardar. Revisa la conexión con el servidor.';
  }
}

function adminLogout() {
  token = '';
  sessionStorage.removeItem('adminToken');
  adminLoginDiv.hidden = false;
  adminPanel.hidden = true;
}

adminPass.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') adminLogin();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeHelp();
    closeAdmin();
    if (searchPanel.classList.contains('open')) {
      searchPanel.classList.remove('open');
      searchInput.value = '';
      applyVisibility();
    }
  }
});

loadSettings();
