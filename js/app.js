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
        <button class="add-cart" onclick="event.stopPropagation();addToCart(${i})" aria-label="Solicitar pelo WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden="true">
           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.89-9.884a9.82 9.82 0 0 1 7.021 2.91 9.83 9.83 0 0 1 2.898 7.025c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.055 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.056 24l6.305-1.654a11.9 11.9 0 0 0 5.69 1.448h.005c6.558 0 11.893-5.335 11.896-11.893a11.82 11.82 0 0 0-3.488-8.413Z"/>
          </svg>
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