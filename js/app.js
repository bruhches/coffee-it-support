/**
 * ============================================================
 * APP — Lógica principal do site
 * ============================================================
 */

/* ----- Utilitários ----- */
function formatCurrency(val) {
  return val.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

/* ----- Render — Produtos ----- */
function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = CONFIG.products.map((p, i) => `
    <div
      class="product-card"
      role="button"
      tabindex="0"
      aria-label="Ver detalhes do serviço ${p.name}"
      onclick="openModal(${i})"
      onkeydown="handleProductKeydown(event, ${i})"
    >
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
      </div>
      <div class="product-footer">
        <span class="price">
          ${p.pricePrefix ? `<small class="price-prefix">${p.pricePrefix}</small>` : ''}
          ${formatCurrency(p.price)}
          ${p.oldPrice ? `<span class="old">${formatCurrency(p.oldPrice)}</span>` : ''}
        </span>
        <button class="add-cart" onclick="event.stopPropagation();addToCart(${i})" aria-label="Solicitar ${p.name} pelo WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden="true">
           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.89-9.884a9.82 9.82 0 0 1 7.021 2.91 9.83 9.83 0 0 1 2.898 7.025c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.055 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.056 24l6.305-1.654a11.9 11.9 0 0 0 5.69 1.448h.005c6.558 0 11.893-5.335 11.896-11.893a11.82 11.82 0 0 0-3.488-8.413Z"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function handleProductKeydown(event, index) {
  if (event.target !== event.currentTarget) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openModal(index);
  }
}

let lastFocusedElement = null;

/* ----- Modal ----- */
function openModal(i) {

  lastFocusedElement = document.activeElement;

  const p = CONFIG.products[i];

  // Imagem
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalImg').alt = p.name;

  // Badge
  const modalBadge = document.getElementById('modalBadge');

  if (p.badge) {
    modalBadge.textContent = p.badge;
    modalBadge.style.display = 'block';
  } else {
    modalBadge.textContent = '';
    modalBadge.style.display = 'none';
  }

  // Título
  document.getElementById('modalTitle').textContent = p.name;

  // Preço + prefixo "A partir de"
  document.getElementById('modalPrice').innerHTML = `
    ${p.pricePrefix ? `<small class="price-prefix">${p.pricePrefix}</small>` : ''}
    ${formatCurrency(p.price)}
    ${p.oldPrice ? `<span class="old">${formatCurrency(p.oldPrice)}</span>` : ''}
  `;

  // Descrição
  document.getElementById('modalDesc').textContent = p.desc;

  // Mensagem do WhatsApp
  const prefix = p.pricePrefix ? `${p.pricePrefix} ` : '';

  const msg = encodeURIComponent(
    `Olá! Vim pelo site da Coffee IT Support e gostaria de mais informações sobre o serviço *${p.name}* — ${prefix}${formatCurrency(p.price)}.`
  );

  document.getElementById('modalWhatsapp').href =
    `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;

  // Abre o modal
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  const modal = document.querySelector('#productModal .modal');

if (modal) {
  setTimeout(() => {
    modal.focus();
  }, 50);
}

}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
  
  if (lastFocusedElement) {
  lastFocusedElement.focus();
  lastFocusedElement = null;
  }

}

function trapModalFocus(event) {
  if (event.key !== 'Tab') return;

  const productModal = document.getElementById('productModal');

  if (!productModal) return;

  const isOpen =
    productModal.classList.contains('active') ||
    productModal.classList.contains('open') ||
    getComputedStyle(productModal).display !== 'none';

  if (!isOpen) return;

  const modal = productModal.querySelector('.modal');

  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (!focusableElements.length) return;

  const firstElement = focusableElements[0];
  const lastElement =
    focusableElements[focusableElements.length - 1];

  if (
    event.shiftKey &&
    document.activeElement === firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
  }

  else if (
    !event.shiftKey &&
    document.activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}

document.addEventListener('keydown', trapModalFocus);

document.getElementById('productModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

/* Fechar modal com tecla Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ----- Add-to-Cart (toast) + WhatsApp redirect ----- */
function addToCart(i) {
  const p = CONFIG.products[i];

  const prefix = p.pricePrefix ? `${p.pricePrefix} ` : '';

  const msg = encodeURIComponent(
    `Olá! Vim pelo site da Coffee IT Support e gostaria de mais informações sobre o serviço *${p.name}* — ${prefix}${formatCurrency(p.price)}.`
  );

  showToast(`${p.name} — abrindo WhatsApp`);

  setTimeout(() => {
    window.open(
      `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`,
      '_blank',
      'noopener,noreferrer'
    );
  }, 600);
}

/* ----- Toast ----- */
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5" fill="none" stroke="#25D366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    ${msg}
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ----- Mobile menu ----- */
let lastMobileMenuFocus = null;

function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const button = document.getElementById('mobileMenuButton');

  if (!menu || !button) return;

  lastMobileMenuFocus = document.activeElement;

  menu.classList.add('active');

  menu.setAttribute('aria-hidden', 'false');
  button.setAttribute('aria-expanded', 'true');

  const closeButton = menu.querySelector('.close-btn');

  if (closeButton) {
    closeButton.focus();
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const button = document.getElementById('mobileMenuButton');

  if (!menu || !button) return;

  menu.classList.remove('active');

  menu.setAttribute('aria-hidden', 'true');
  button.setAttribute('aria-expanded', 'false');

  if (lastMobileMenuFocus) {
    lastMobileMenuFocus.focus();
    lastMobileMenuFocus = null;
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  const menu = document.getElementById('mobileMenu');

  if (menu && menu.classList.contains('active')) {
    closeMobileMenu();
  }
});

function trapMobileMenuFocus(event) {
  if (event.key !== 'Tab') return;

  const menu = document.getElementById('mobileMenu');

  if (!menu || !menu.classList.contains('active')) return;

  const focusableElements = menu.querySelectorAll(
    'a[href], button:not([disabled])'
  );

  if (!focusableElements.length) return;

  const firstElement = focusableElements[0];
  const lastElement =
    focusableElements[focusableElements.length - 1];

  if (
    event.shiftKey &&
    document.activeElement === firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
  } else if (
    !event.shiftKey &&
    document.activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}

document.addEventListener('keydown', trapMobileMenuFocus);

/* ============================================================
   INSTAGRAM LIVE FEED — seguro

   O navegador NÃO recebe o token do Instagram. A chamada é feita
   para /api/instagram, e a função serverless usa a variável de
   ambiente INSTAGRAM_ACCESS_TOKEN no servidor.
   ============================================================ */

function showInstagramSkeleton() {
  const grid = document.getElementById('igGrid');

  if (!grid) return;

  grid.innerHTML = Array.from({ length: 6 }, () => `
    <div class="ig-skeleton" aria-hidden="true">
      <div class="ig-skeleton-shimmer"></div>
    </div>
  `).join('');
}

async function fetchInstagram() {
  const grid = document.getElementById('igGrid');

  if (!grid) return;

  grid.setAttribute('aria-busy', 'true');

  try {
    const res = await fetch('/api/instagram');

    if (!res.ok) {
      throw new Error(`Instagram API: HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data.data)) {
    throw new Error('Resposta inválida do feed do Instagram');
    }

    if (data.data.length === 0) {
    throw new Error('Nenhuma publicação encontrada no Instagram');
    }

    grid.innerHTML = data.data.map(p => `
      <a
        class="ig-card"
        href="${p.permalink}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir publicação da Coffee IT Support no Instagram — ${p.like_count || 0} curtidas e ${p.comments_count || 0} comentários"
      >
        <img
          src="${p.media_url}"
          alt="Publicação da Coffee IT Support no Instagram"
          loading="lazy"
        >

        <div class="ig-overlay">
          <span class="ig-stat">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>

            ${p.like_count || 0}
          </span>

          <span class="ig-stat">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>

            ${p.comments_count || 0}
          </span>
        </div>
      </a>
    `).join('');

    grid.setAttribute('aria-busy', 'false');

  } catch (err) {
    console.error('Não foi possível carregar o feed do Instagram:', err);

    grid.innerHTML = `
      <div class="ig-error">
        <p>Não foi possível carregar o Instagram no momento.</p>

        <a
          href="https://instagram.com/coffeitsup"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver perfil no Instagram
        </a>
      </div>
    `;

    grid.setAttribute('aria-busy', 'false');
  }
}

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');

  if (!themeToggle || !themeIcon) return;

  const savedTheme = localStorage.getItem('theme');

  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  const initialTheme =
    savedTheme || (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const isDark = theme === 'dark';

    themeIcon.textContent = isDark ? '☀' : '☾';

    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
    );
  }

  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme =
      document.documentElement.getAttribute('data-theme');

    const newTheme =
      currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);

    localStorage.setItem('theme', newTheme);
  });
}

/* ----- Inicialização ----- */
function init() {
  initTheme();

  renderProducts();
  showInstagramSkeleton();
  fetchInstagram();
}

document.addEventListener('DOMContentLoaded', init);