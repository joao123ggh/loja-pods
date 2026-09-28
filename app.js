/**
 * ====================================================================
 * APLICAÇÃO PRINCIPAL - CATÁLOGO LUMEN CO.
 * Versão 2.0 com Sacola WhatsApp, Filtro de Marcas e Painel Admin
 * ====================================================================
 */

// Estado Global da Aplicação
let allProducts = [];
let cart = [];
let currentCategory = 'all';
let currentBrand = 'all';
let currentSearchTerm = '';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  loadProductsData();
  loadCart();
  initAgeModal();
  initStoreConfig();
  populateBrandFilter();
  renderAllCategories();
  initSearchAndFilters();
  initModals();
  initCartDrawer();
  initAdminPanel();
  initMobileMenu();
  initHeroScene();
}

/**
 * Carrega dados iniciais e mescla com produtos cadastrados pelo usuário via Painel
 */
function loadProductsData() {
  allProducts = [...PRODUCTS_DATA];
  const customProducts = localStorage.getItem('lumen_custom_products');
  if (customProducts) {
    try {
      const parsed = JSON.parse(customProducts);
      const existingIds = new Set(allProducts.map(p => p.id));
      parsed.forEach(p => {
        if (p.category === 'pods' && !existingIds.has(p.id)) {
          allProducts.push(p);
          existingIds.add(p.id);
        }
      });
    } catch (e) {
      allProducts = [...PRODUCTS_DATA];
    }
  }
}

/**
 * Formata números para o padrão de moeda brasileiro (R$ 00,00)
 */
function formatCurrency(value) {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Cria a URL direta para o WhatsApp com mensagem codificada
 */
function getWhatsAppUrl(customMessage) {
  const number = STORE_CONFIG.whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent(customMessage || STORE_CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Atualiza links e textos estáticos de WhatsApp e da Loja
 */
function initStoreConfig() {
  const defaultUrl = getWhatsAppUrl("Olá! Gostaria de consultar a disponibilidade de pods na Roleta dos Pods.");

  const navBtn = document.getElementById('btnNavWhatsapp');
  const mobileBtn = document.getElementById('btnMobileWhatsapp');
  const footerBtn = document.getElementById('btnFooterWhatsapp');
  const floatingBtn = document.getElementById('floatingWhatsapp');
  const brandTitle = document.getElementById('brandTitle');
  const footerBrand = document.getElementById('footerBrandName');

  if (navBtn) navBtn.href = defaultUrl;
  if (mobileBtn) mobileBtn.href = defaultUrl;
  if (footerBtn) footerBtn.href = defaultUrl;
  if (floatingBtn) floatingBtn.href = defaultUrl;
  if (brandTitle) brandTitle.innerHTML = 'ROLETA<span class="text-emerald-500">.</span>PODS';
  if (footerBrand) footerBrand.textContent = STORE_CONFIG.storeName;
}

/**
 * Popula dinamicamente as opções do filtro de marcas
 */
function populateBrandFilter() {
  const brandSelect = document.getElementById('brandFilter');
  if (!brandSelect) return;

  // Filtrar marcas de acordo com a categoria ativa ou todas
  const productsToConsider = currentCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === currentCategory);

  const brands = Array.from(new Set(productsToConsider.map(p => p.brand).filter(Boolean))).sort();

  brandSelect.innerHTML = `<option value="all">Todas as Marcas (${brands.length})</option>`;
  brands.forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    brandSelect.appendChild(opt);
  });

  brandSelect.value = currentBrand;
}

/**
 * Gera um SVG elegante de fallback caso a imagem do produto falhe
 */
function getFallbackSvgImage(category, title) {
  let icon = '⚡';
  let color = '#10b981';
  if (category === 'vapes') {
    icon = '💨';
    color = '#06b6d4';
  } else if (category === 'cigarros') {
    icon = '🔥';
    color = '#f59e0b';
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#12161f"/>
        <stop offset="100%" stop-color="#0a0c10"/>
      </linearGradient>
    </defs>
    <rect width="600" height="450" fill="url(#bgGrad)"/>
    <circle cx="300" cy="200" r="70" fill="${color}" fill-opacity="0.12"/>
    <text x="300" y="225" font-size="64" text-anchor="middle" fill="${color}">${icon}</text>
    <text x="300" y="320" font-size="20" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#f3f4f6">${title.replace(/"/g, '')}</text>
    <text x="300" y="350" font-size="14" font-family="sans-serif" text-anchor="middle" fill="#9ca3af">LUMEN CO. CATALOG</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Renderiza os produtos na seção de Pods
 */
function renderAllCategories() {
  const podsGrid = document.getElementById('pods-grid');
  const pods = allProducts.filter(p => p.category === 'pods');

  if (podsGrid) {
    podsGrid.innerHTML = pods.map(p => createProductCardHtml(p)).join('');
  }

  attachCardEvents();
}

/**
 * Gera o código HTML para o Card de Produto
 */
function createProductCardHtml(product) {
  let badgeClass = 'badge-emerald';
  if (product.badge === 'Mais Vendido') badgeClass = 'badge-gold';
  if (product.badge === 'Lançamento' || product.badge === 'Destaque' || product.badge === 'Sensação') badgeClass = 'badge-cyan';
  if (product.badge === 'Personalizável' || product.badge === 'Extra Ice') badgeClass = 'badge-emerald';

  const badgeHtml = product.badge 
    ? `<span class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeClass} shadow-md z-10">${product.badge}</span>` 
    : '';

  const variationLabel = 'Sabor:';
  const quantityLabel = 'Puffs:';
  const categoryColor = 'text-emerald-400';

  const specsHtml = product.specs && product.specs.length > 0 
    ? product.specs.slice(0, 2).map(s => `<span class="inline-block px-2 py-0.5 rounded bg-white/5 text-[11px] text-gray-300">${s}</span>`).join(' ')
    : '';

  const fallbackUrl = getFallbackSvgImage(product.category, product.name);

  return `
    <article class="glass-card rounded-2xl overflow-hidden flex flex-col group relative" data-product-id="${product.id}">
      
      <!-- Imagem do Produto com Efeito Zoom e Enquadramento Completo -->
      <div class="relative w-full aspect-[4/3] bg-[#090c12] overflow-hidden cursor-pointer btn-open-detail p-3 flex items-center justify-center" data-id="${product.id}">
        ${badgeHtml}
        <img 
          src="${product.image || fallbackUrl}" 
          alt="${product.name}" 
          loading="lazy"
          onerror="this.onerror=null;this.src='${fallbackUrl}';"
          class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#12161f]/40 via-transparent to-transparent pointer-events-none"></div>
        
        <!-- Indicador de Categoria no Canto -->
        <span class="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
          POD
        </span>
      </div>

      <!-- Conteúdo do Card -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <!-- Marca & Disponibilidade -->
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">${product.brand}</span>
            <span class="text-[11px] text-emerald-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Em estoque
            </span>
          </div>

          <!-- Nome do Produto -->
          <h3 class="text-base sm:text-lg font-bold text-white mb-2 group-hover:${categoryColor} transition line-clamp-1 cursor-pointer btn-open-detail" data-id="${product.id}">
            ${product.name}
          </h3>

          <!-- Atributos Chave -->
          <div class="space-y-1 text-xs text-gray-400 mb-3 bg-white/[0.02] p-2 rounded-lg border border-white/5">
            <div class="flex justify-between">
              <span>${variationLabel}</span>
              <strong class="text-gray-200">${product.variation}</strong>
            </div>
            <div class="flex justify-between">
              <span>${quantityLabel}</span>
              <strong class="text-gray-200">${product.quantity}</strong>
            </div>
          </div>

          <!-- Badges de Specs -->
          <div class="flex flex-wrap gap-1 mb-4">
            ${specsHtml}
          </div>
        </div>

        <!-- Preço e Botões de Ação -->
        <div class="pt-3 border-t border-white/5">
          <div class="flex items-baseline justify-between mb-3">
            <span class="text-xs text-gray-400">Preço</span>
            <span class="text-xl font-black font-display text-emerald-400">${formatCurrency(product.price)}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button class="btn-open-detail w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold border border-white/10 transition flex items-center justify-center gap-1.5" data-id="${product.id}">
              <i class="fa-solid fa-eye text-xs"></i> Detalhes
            </button>
            <button class="btn-add-cart btn-glow w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40" data-id="${product.id}">
              <i class="fa-solid fa-cart-plus text-xs"></i> + Sacola
            </button>
          </div>
        </div>

      </div>

    </article>
  `;
}

/**
 * Atribui os eventos de clique aos botões dos cards
 */
function attachCardEvents() {
  document.querySelectorAll('.btn-open-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-id');
      openProductDetailModal(productId);
    });
  });

  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-id');
      addToCart(productId);
    });
  });
}

/**
 * Modal de Detalhes do Produto
 */
function openProductDetailModal(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productDetailModal');
  const modalImg = document.getElementById('modalProductImage');
  const modalBadge = document.getElementById('modalProductBadge');
  const modalCat = document.getElementById('modalProductCategory');
  const modalName = document.getElementById('modalProductName');
  const modalBrandModel = document.getElementById('modalProductBrandModel');
  const modalPrice = document.getElementById('modalProductPrice');
  const modalVariation = document.getElementById('modalProductVariation');
  const modalQuantity = document.getElementById('modalProductQuantity');
  const modalSpecs = document.getElementById('modalProductSpecs');
  const modalDesc = document.getElementById('modalProductDescription');
  const modalWhatsapp = document.getElementById('modalWhatsappBtn');
  const modalAddCart = document.getElementById('modalAddCartBtn');

  const fallbackUrl = getFallbackSvgImage(product.category, product.name);
  modalImg.src = product.image || fallbackUrl;
  modalImg.onerror = () => { modalImg.src = fallbackUrl; };
  modalImg.alt = product.name;

  if (product.badge) {
    modalBadge.className = `absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${product.badge === 'Mais Vendido' ? 'badge-gold' : 'badge-emerald'}`;
    modalBadge.textContent = product.badge;
    modalBadge.classList.remove('hidden');
  } else {
    modalBadge.classList.add('hidden');
  }

  modalCat.textContent = `Categoria: ${product.category.toUpperCase()}`;
  modalName.textContent = product.name;
  modalBrandModel.textContent = `${product.brand} • ${product.model || ''}`;
  modalPrice.textContent = formatCurrency(product.price);
  modalVariation.textContent = product.variation;
  modalQuantity.textContent = product.quantity;
  modalDesc.textContent = product.description || 'Produto original com garantia de procedência e qualidade superior.';

  const varLabel = document.getElementById('modalVariationLabel');
  const qtyLabel = document.getElementById('modalQuantityLabel');
  if (product.category === 'vapes') {
    if (varLabel) varLabel.textContent = "Cor / Versão:";
    if (qtyLabel) qtyLabel.textContent = "Capacidade / Bateria:";
  } else if (product.category === 'cigarros') {
    if (varLabel) varLabel.textContent = "Blend / Sabor:";
    if (qtyLabel) qtyLabel.textContent = "Quantidade / Box:";
  } else {
    if (varLabel) varLabel.textContent = "Sabor / Cor:";
    if (qtyLabel) qtyLabel.textContent = "Autonomia / Puffs:";
  }

  if (modalSpecs) {
    modalSpecs.innerHTML = (product.specs || []).map(spec => 
      `<span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs">${spec}</span>`
    ).join('');
  }

  const msg = `Olá! Estava visualizando o catálogo e tenho interesse no produto:\n- *${product.name}*\n- Marca: ${product.brand}\n- Variação: ${product.variation}\n- Preço: ${formatCurrency(product.price)}\n\nEstá disponível?`;
  modalWhatsapp.href = getWhatsAppUrl(msg);

  modalAddCart.onclick = () => {
    addToCart(product.id);
    closeProductDetailModal();
  };

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductDetailModal() {
  const modal = document.getElementById('productDetailModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Sistema de Busca e Filtros em Tempo Real
 */
function initSearchAndFilters() {
  const searchInput = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const brandQuickBtns = document.querySelectorAll('.brand-quick-btn');
  const brandSelect = document.getElementById('brandFilter');
  const searchResultsSection = document.getElementById('searchResultsSection');
  const searchGrid = document.getElementById('search-grid');
  const searchNoResults = document.getElementById('searchNoResults');
  const searchSummaryText = document.getElementById('searchSummaryText');
  const filterStatus = document.getElementById('filterStatus');
  const filterCount = document.getElementById('filterCount');
  const btnResetFilters = document.getElementById('btnResetFilters');
  const categorySections = document.querySelectorAll('.category-section');

  function updateBrandQuickBtnsUI(activeBrand) {
    brandQuickBtns.forEach(btn => {
      const bFilter = btn.getAttribute('data-brand-filter');
      if (bFilter === activeBrand) {
        btn.classList.add('active', 'bg-emerald-600', 'text-white');
        btn.classList.remove('bg-white/5', 'text-gray-300', 'hover:bg-white/10');
      } else {
        btn.classList.remove('active', 'bg-emerald-600', 'text-white');
        btn.classList.add('bg-white/5', 'text-gray-300', 'hover:bg-white/10');
      }
    });
  }

  function applyFilters() {
    const term = currentSearchTerm.trim().toLowerCase();

    if (term.length > 0) {
      btnClearSearch.classList.remove('hidden');
    } else {
      btnClearSearch.classList.add('hidden');
    }

    const filtered = allProducts.filter(product => {
      const matchBrand = currentBrand === 'all' || 
        product.brand.toLowerCase() === currentBrand.toLowerCase() ||
        product.brand.toLowerCase().includes(currentBrand.toLowerCase());

      const textToSearch = [
        product.name,
        product.brand,
        product.model,
        product.variation,
        product.category,
        ...(product.specs || [])
      ].join(' ').toLowerCase();

      const matchText = term === '' || textToSearch.includes(term);

      return matchBrand && matchText;
    });

    const isFilteredView = term.length > 0 || currentBrand !== 'all';

    if (isFilteredView) {
      categorySections.forEach(sec => sec.classList.add('hidden'));
      searchResultsSection.classList.remove('hidden');

      searchSummaryText.textContent = `${filtered.length} pod(s) encontrado(s) para os filtros selecionados.`;

      if (filtered.length > 0) {
        searchGrid.innerHTML = filtered.map(p => createProductCardHtml(p)).join('');
        searchNoResults.classList.add('hidden');
        searchGrid.classList.remove('hidden');
      } else {
        searchGrid.innerHTML = '';
        searchGrid.classList.add('hidden');
        searchNoResults.classList.remove('hidden');
      }

      attachCardEvents();
      filterStatus.classList.remove('hidden');
      filterCount.textContent = `${filtered.length} pod(s) encontrado(s)`;
    } else {
      searchResultsSection.classList.add('hidden');
      categorySections.forEach(sec => sec.classList.remove('hidden'));
      filterStatus.classList.add('hidden');
    }
  }

  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    applyFilters();
  });

  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    currentSearchTerm = '';
    applyFilters();
    searchInput.focus();
  });

  brandQuickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedBrand = btn.getAttribute('data-brand-filter');
      currentBrand = selectedBrand;
      if (brandSelect) brandSelect.value = currentBrand;
      updateBrandQuickBtnsUI(currentBrand);
      applyFilters();
    });
  });

  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      currentBrand = e.target.value;
      updateBrandQuickBtnsUI(currentBrand);
      applyFilters();
    });
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchTerm = '';
      currentBrand = 'all';

      if (brandSelect) brandSelect.value = 'all';
      updateBrandQuickBtnsUI('all');
      applyFilters();
    });
  }
}

/**
 * ====================================================================
 * SISTEMA DA SACOLA DE PEDIDOS (CARRINHO WHATSAPP)
 * ====================================================================
 */
function loadCart() {
  const saved = localStorage.getItem('lumen_cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }
  updateCartBadges();
}

function saveCart() {
  localStorage.setItem('lumen_cart', JSON.stringify(cart));
  updateCartBadges();
  renderCartItems();
}

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      variation: product.variation,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });
  }

  saveCart();
  showToast(`"${product.name}" adicionado à sacola!`);
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  showToast('Item removido da sacola.');
}

function clearCart() {
  cart = [];
  saveCart();
  showToast('Sacola esvaziada.');
}

function updateCartBadges() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const headerBadge = document.getElementById('cartCountBadge');
  const mobileBadge = document.getElementById('cartMobileCountBadge');
  const floatingBadge = document.getElementById('floatingCartBadge');

  if (headerBadge) headerBadge.textContent = totalCount;
  if (mobileBadge) mobileBadge.textContent = totalCount;
  if (floatingBadge) floatingBadge.textContent = totalCount;
}

function renderCartItems() {
  const container = document.getElementById('cartItemsList');
  const totalPriceEl = document.getElementById('cartTotalPrice');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <i class="fa-solid fa-bag-shopping text-4xl text-gray-600 mb-3 block"></i>
        <p class="text-gray-300 font-bold text-sm mb-1">Sua sacola está vazia</p>
        <p class="text-gray-500 text-xs">Explore o catálogo e adicione os itens que desejar pedir!</p>
      </div>
    `;
    if (totalPriceEl) totalPriceEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const fallbackUrl = getFallbackSvgImage(item.category, item.name);

    return `
      <div class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <img 
          src="${item.image || fallbackUrl}" 
          alt="${item.name}" 
          onerror="this.onerror=null;this.src='${fallbackUrl}';"
          class="w-14 h-14 rounded-lg object-cover bg-black/40 border border-white/10"
        />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-white truncate">${item.name}</h4>
          <p class="text-[11px] text-gray-400 truncate">${item.variation}</p>
          <span class="text-xs font-black text-emerald-400">${formatCurrency(item.price)}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
          <button onclick="updateCartQuantity('${item.id}', -1)" class="w-6 h-6 rounded bg-white/5 hover:bg-white/15 text-white flex items-center justify-center text-xs transition">
            -
          </button>
          <span class="text-xs font-bold px-1 text-white">${item.quantity}</span>
          <button onclick="updateCartQuantity('${item.id}', 1)" class="w-6 h-6 rounded bg-white/5 hover:bg-white/15 text-white flex items-center justify-center text-xs transition">
            +
          </button>
        </div>
        <button onclick="removeFromCart('${item.id}')" class="text-gray-500 hover:text-red-400 p-1.5 transition text-xs" title="Remover item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  }).join('');

  if (totalPriceEl) totalPriceEl.textContent = formatCurrency(total);
}

function initCartDrawer() {
  const backdrop = document.getElementById('cartDrawerBackdrop');
  const drawer = document.getElementById('cartDrawer');
  const btnOpen = document.getElementById('btnOpenCart');
  const btnMobileCart = document.getElementById('btnMobileCart');
  const btnFloatingCart = document.getElementById('floatingCartBtn');
  const btnClose = document.getElementById('btnCloseCart');
  const btnCheckout = document.getElementById('btnCheckoutCart');
  const btnClear = document.getElementById('btnClearCart');

  function openCart() {
    renderCartItems();
    backdrop.classList.add('active');
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    backdrop.classList.remove('active');
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  if (btnOpen) btnOpen.addEventListener('click', openCart);
  if (btnMobileCart) btnMobileCart.addEventListener('click', openCart);
  if (btnFloatingCart) btnFloatingCart.addEventListener('click', openCart);
  if (btnClose) btnClose.addEventListener('click', closeCart);

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCart();
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', clearCart);
  }

  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Sua sacola está vazia!', 'warning');
        return;
      }

      let total = 0;
      let textLines = [
        `*SOLICITAÇÃO DE PEDIDO - ${STORE_CONFIG.storeName}*`,
        `Data: ${new Date().toLocaleDateString('pt-BR')}`,
        `----------------------------------------`
      ];

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        textLines.push(`${index + 1}. *${item.quantity}x ${item.name}*`);
        textLines.push(`   Variação: ${item.variation}`);
        textLines.push(`   Unitário: ${formatCurrency(item.price)} | Subtotal: ${formatCurrency(itemTotal)}`);
      });

      textLines.push(`----------------------------------------`);
      textLines.push(`*TOTAL ESTIMADO: ${formatCurrency(total)}*`);
      textLines.push(`\nOlá! Gostaria de confirmar a disponibilidade dos itens acima e combinar a entrega/pagamento!`);

      const fullMessage = textLines.join('\n');
      window.open(getWhatsAppUrl(fullMessage), '_blank');
    });
  }
}

/**
 * ====================================================================
 * PAINEL ADMINISTRATIVO: CADASTRAR PRODUTO & EXPORTAR PRODUCTS.JS
 * ====================================================================
 */
function initAdminPanel() {
  const modal = document.getElementById('adminModal');
  const btnOpen = document.getElementById('btnOpenAdmin');
  const btnMobile = document.getElementById('btnMobileAdmin');
  const btnFooter = document.getElementById('btnFooterAdmin');
  const btnClose = document.getElementById('btnCloseAdmin');
  const form = document.getElementById('newProductForm');
  const btnExport = document.getElementById('btnExportJs');

  function openAdmin() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAdmin() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnOpen) btnOpen.addEventListener('click', openAdmin);
  if (btnMobile) btnMobile.addEventListener('click', openAdmin);
  if (btnFooter) btnFooter.addEventListener('click', openAdmin);
  if (btnClose) btnClose.addEventListener('click', closeAdmin);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAdmin();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const newProduct = {
        id: 'prod-' + Date.now(),
        category: document.getElementById('admCategory').value,
        name: document.getElementById('admName').value.trim(),
        brand: document.getElementById('admBrand').value.trim(),
        model: document.getElementById('admModel').value.trim() || document.getElementById('admName').value.trim(),
        variation: document.getElementById('admVariation').value.trim(),
        quantity: document.getElementById('admQuantity').value.trim(),
        price: parseFloat(document.getElementById('admPrice').value),
        badge: document.getElementById('admBadge').value.trim(),
        image: document.getElementById('admImage').value.trim(),
        specs: document.getElementById('admSpecs').value.split(',').map(s => s.trim()).filter(Boolean),
        description: document.getElementById('admDescription').value.trim() || 'Produto original com garantia de qualidade.'
      };

      allProducts.unshift(newProduct);

      // Salva customizados no localStorage
      const customProducts = JSON.parse(localStorage.getItem('lumen_custom_products') || '[]');
      customProducts.unshift(newProduct);
      localStorage.setItem('lumen_custom_products', JSON.stringify(customProducts));

      renderAllCategories();
      populateBrandFilter();
      form.reset();
      closeAdmin();
      showToast(`Produto "${newProduct.name}" cadastrado com sucesso!`);
    });
  }

  // Exportar / Baixar arquivo products.js atualizado
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const fileContent = `/**
 * ====================================================================
 * BANCO DE DADOS ATUALIZADO DO CATÁLOGO LUMEN CO.
 * Exportado em: ${new Date().toLocaleString('pt-BR')}
 * ====================================================================
 */

const STORE_CONFIG = ${JSON.stringify(STORE_CONFIG, null, 2)};

const CATEGORY_BANNERS = ${JSON.stringify(CATEGORY_BANNERS, null, 2)};

const PRODUCTS_DATA = ${JSON.stringify(allProducts, null, 2)};
`;

      const blob = new Blob([fileContent], { type: 'text/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Arquivo products.js atualizado baixado com sucesso!');
    });
  }
}

/**
 * Toast Notifications
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'py-2.5 px-4 rounded-xl bg-[#12161f] border border-emerald-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 transform translate-y-2 opacity-0 transition-all duration-300 pointer-events-auto';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Inicialização dos Modais
 */
function initModals() {
  const closeBtn = document.getElementById('btnCloseDetailModal');
  const detailModal = document.getElementById('productDetailModal');

  if (closeBtn) closeBtn.addEventListener('click', closeProductDetailModal);

  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeProductDetailModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductDetailModal();
      const adminModal = document.getElementById('adminModal');
      if (adminModal) adminModal.classList.remove('active');
    }
  });
}

/**
 * Modal de Confirmação de Maioridade (+18)
 */
function initAgeModal() {
  const ageModal = document.getElementById('ageModal');
  const btnConfirm = document.getElementById('btnConfirmAge');
  const btnDeny = document.getElementById('btnDenyAge');

  const hasConfirmed = localStorage.getItem('lumen_age_verified');

  if (!hasConfirmed && ageModal) {
    ageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      localStorage.setItem('lumen_age_verified', 'true');
      ageModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (btnDeny) {
    btnDeny.addEventListener('click', () => {
      alert("Acesso restrito para maiores de 18 anos.");
      window.location.href = "https://www.google.com";
    });
  }
}

/**
 * Menu Responsivo para Smartphones
 */
function initMobileMenu() {
  const btnToggle = document.getElementById('btnMobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!btnToggle || !mobileMenu) return;

  btnToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  });

    navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    });
  });
}

/**
 * ====================================================================
 * CENA HERO 3D FUTURISTA: FUMAÇA CANVAS, PARTÍCULAS & PARALLAX
 * ====================================================================
 */
function initHeroScene() {
  const canvas = document.getElementById('heroSmokeCanvas');
  const heroSection = document.getElementById('inicio');
  const stage = document.getElementById('heroFloatingStage');
  if (!canvas || !heroSection || !stage) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let isVisible = true;

  // Ajuste dinâmico de resolução do Canvas
  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Monitorar visibilidade para economia de GPU/CPU
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }

  // Partículas de Fumaça Suave e Névoa
  class SmokeParticle {
    constructor(originType = 'pod_right') {
      this.reset(originType);
    }

    reset(originType) {
      this.type = originType;
      if (this.type === 'pod_right') {
        this.x = width * (window.innerWidth < 768 ? 0.7 : 0.82) + (Math.random() - 0.5) * 40;
        this.y = height * (window.innerWidth < 768 ? 0.55 : 0.6) + (Math.random() - 0.5) * 20;
        this.vx = (Math.random() - 0.5) * 0.4 - 0.15;
        this.vy = -(0.4 + Math.random() * 0.6);
        this.radius = 18 + Math.random() * 25;
        this.growth = 0.35 + Math.random() * 0.3;
        this.maxRadius = 140 + Math.random() * 80;
        this.alpha = 0.01;
        this.maxAlpha = 0.12 + Math.random() * 0.1;
        this.colorType = Math.random() > 0.4 ? 'emerald' : 'cyan';
      } else {
        // Vapor emanando do pod da esquerda (Venum Punch 35K)
        this.x = width * (window.innerWidth < 768 ? 0.35 : 0.22) + (Math.random() - 0.5) * 20;
        this.y = height * (window.innerWidth < 768 ? 0.8 : 0.75) + (Math.random() - 0.5) * 15;
        this.vx = (Math.random() - 0.5) * 0.35 + 0.1;
        this.vy = -(0.5 + Math.random() * 0.5);
        this.radius = 12 + Math.random() * 15;
        this.growth = 0.25 + Math.random() * 0.25;
        this.maxRadius = 110 + Math.random() * 60;
        this.alpha = 0.01;
        this.maxAlpha = 0.14 + Math.random() * 0.1;
        this.colorType = Math.random() > 0.5 ? 'cyan' : 'emerald';
      }
      this.life = 0;
      this.maxLife = 200 + Math.random() * 120;
    }

    update() {
      this.life++;
      this.x += this.vx + Math.sin(this.life * 0.02) * 0.35;
      this.y += this.vy;
      this.radius += this.growth;

      const progress = this.life / this.maxLife;
      if (progress < 0.2) {
        this.alpha = (progress / 0.2) * this.maxAlpha;
      } else {
        this.alpha = (1 - (progress - 0.2) / 0.8) * this.maxAlpha;
      }

      if (this.life >= this.maxLife || this.y < -this.radius || this.alpha <= 0.001) {
        this.reset(this.type);
      }
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, Math.max(1, this.radius)
      );

      if (this.colorType === 'emerald') {
        grad.addColorStop(0, `rgba(16, 185, 129, ${this.alpha * 0.8})`);
        grad.addColorStop(0.35, `rgba(52, 211, 153, ${this.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(6, 182, 212, 0)`);
      } else {
        grad.addColorStop(0, `rgba(6, 182, 212, ${this.alpha * 0.8})`);
        grad.addColorStop(0.4, `rgba(14, 165, 233, ${this.alpha * 0.35})`);
        grad.addColorStop(1, `rgba(10, 12, 16, 0)`);
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Micropartículas de luz e pó neon flutuantes
  class NeonParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = 1 + Math.random() * 2.2;
      this.vy = -(0.2 + Math.random() * 0.4);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.5 ? '#10b981' : (Math.random() > 0.5 ? '#06b6d4' : '#34d399');
    }

    update(time) {
      this.y += this.vy;
      this.x += this.vx;
      this.alpha = 0.3 + 0.4 * Math.sin(time * this.pulseSpeed + this.pulseOffset);

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Instanciar grupos de vapor e partículas neon
  const smokeParticles = [];
  for (let i = 0; i < 14; i++) {
    const p = new SmokeParticle('pod_right');
    p.life = Math.random() * p.maxLife;
    smokeParticles.push(p);
  }
  for (let i = 0; i < 10; i++) {
    const p = new SmokeParticle('pod_left');
    p.life = Math.random() * p.maxLife;
    smokeParticles.push(p);
  }

  const neonParticles = [];
  for (let i = 0; i < 32; i++) {
    neonParticles.push(new NeonParticle());
  }

  // =========================================================
  // PARALLAX SUAVE COM MOUSE & BALANÇO AUTÔNOMO
  // =========================================================
  const layers = Array.from(stage.querySelectorAll('.hero-parallax-layer'));
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let isMouseOver = false;

  heroSection.addEventListener('mousemove', (e) => {
    isMouseOver = true;
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    targetMouseX = x / (rect.width / 2);
    targetMouseY = y / (rect.height / 2);
  });

  heroSection.addEventListener('mouseleave', () => {
    isMouseOver = false;
    targetMouseX = 0;
    targetMouseY = 0;
  });

  // Loop de Animação 60fps
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    time++;
    ctx.clearRect(0, 0, width, height);

    // Renderizar fumaça
    smokeParticles.forEach(p => {
      p.update();
      p.draw();
    });

    // Renderizar micropartículas
    neonParticles.forEach(p => {
      p.update(time);
      p.draw();
    });

    // Interpolação suave do mouse (Lerp)
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    // Balanço sutil contínuo mesmo sem mouse (repouso e mobile)
    const ambientX = Math.sin(time * 0.015) * 0.08;
    const ambientY = Math.cos(time * 0.012) * 0.08;

    const finalX = currentMouseX + ambientX;
    const finalY = currentMouseY + ambientY;

    layers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0.2;
      const moveX = finalX * depth * 35;
      const moveY = finalY * depth * 25;
      const tiltX = -finalY * depth * 6;
      const tiltY = finalX * depth * 6;

      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
  }

  animate();
}
