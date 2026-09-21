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
    <div class="product-card" onclick="openModal(${i})">
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
        <button class="add-cart" onclick="event.stopPropagation();addToCart(${i})" aria-label="Adicionar">
          <svg viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

/* ----- Render — Instagram ----- */
function renderInstagram() {
  const grid = document.getElementById('igGrid');
  grid.innerHTML = CONFIG.instagramPosts.map(p => `
    <a class="ig-card" href="https://instagram.com/${CONFIG.instagramUser}" target="_blank">
      <img src="${p.img}" alt="Post do Instagram" loading="lazy">
      <div class="ig-overlay">
        <span class="ig-stat">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          ${p.likes}
        </span>
        <span class="ig-stat">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${p.comments}
        </span>
      </div>
    </a>
  `).join('');

  /* Atualiza links e textos com o @ configurado */
  document.querySelectorAll('.ig-header a, .footer-col a[href*="instagram"]').forEach(a => {
    a.href = `https://instagram.com/${CONFIG.instagramUser}`;
  });
  const igTitle = document.querySelector('.ig-header h2');
  if (igTitle) igTitle.textContent = `@${CONFIG.instagramUser}`;
}

/* ----- Modal ----- */
function openModal(i) {
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
    `Olá! Tenho interesse no serviço: *${p.name}* — ${prefix}${formatCurrency(p.price)}`
  );

  document.getElementById('modalWhatsapp').href =
    `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;

  // Abre o modal
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

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
  const msg = encodeURIComponent(`Olá! Quero comprar: *${p.name}* — ${formatCurrency(p.price)}`);
  showToast(`${p.name} — abrir WhatsApp para comprar`);
  setTimeout(() => {
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank');
  }, 600);
}

/* ----- Toast ----- */
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="#25D366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    ${msg}
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ----- Mobile menu ----- */
function openMobileMenu() {
  document.querySelector('.mobile-menu').classList.add('active');
}

function closeMobileMenu() {
  document.querySelector('.mobile-menu').classList.remove('active');
}

/* ============================================================
   INSTAGRAM LIVE FEED — seguro

   O navegador NÃO recebe o token do Instagram. A chamada é feita
   para /api/instagram, e a função serverless usa a variável de
   ambiente INSTAGRAM_ACCESS_TOKEN no servidor.
   ============================================================ */

async function fetchInstagram() {
  const grid = document.getElementById('igGrid');

  try {
    const res = await fetch('/api/instagram');
    if (!res.ok) throw new Error(`Instagram API: HTTP ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data.data)) throw new Error('Resposta inválida do feed do Instagram');

    grid.innerHTML = data.data.map(p => `
      <a class="ig-card" href="${p.permalink}" target="_blank" rel="noopener noreferrer">
        <img src="${p.media_url}" alt="Instagram post" loading="lazy">
        <div class="ig-overlay">
          <span class="ig-stat">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ${p.like_count || 0}
          </span>
          <span class="ig-stat">
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            ${p.comments_count || 0}
          </span>
        </div>
      </a>
    `).join('');
  } catch (err) {
    console.error('Não foi possível carregar o feed do Instagram:', err);
    // Mantém os cards estáticos de config.js como fallback.
  }
}


/* ----- Inicialização ----- */
function init() {
  /* Atualiza nome da marca na navbar e footer */
  document.querySelectorAll('.logo').forEach(el => el.textContent = CONFIG.brandName);

  renderProducts();
  renderInstagram();

  /* Tenta carregar o feed real via backend seguro; em falha, mantém o fallback estático. */
  fetchInstagram();
}

document.addEventListener('DOMContentLoaded', init);