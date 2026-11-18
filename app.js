/**
 * LAARA – Main Application JS
 * Handles: navigation, cart, product grid, quick-view,
 *          reviews carousel, search, modals, animations.
 */

/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
const state = {
  cart: JSON.parse(localStorage.getItem('laara_cart') || '[]'),
  activeFilter: 'all',
  sortBy: 'default',
  reviewIndex: 0,
  quickViewProduct: null,
  quickViewSize: null,
  quickViewColor: null,
  quickViewQty: 1,
  modalQty: 1,
};

/* ════════════════════════════════════════
   UTILS
════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function fmt(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function stars(n) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < n ? 'var(--gold)' : '#ccc'}">★</span>`
  ).join('');
}

function showToast(msg, duration = 2600) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function preventBodyScroll(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
}

/* ════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════ */
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
(function initNav() {
  const header = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');
  const mobileClose = $('#mobileNavClose');
  const mobileLinks = $$('.mobile-nav-link');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  // Scroll effects
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // Mobile nav
  function openMobileNav() {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    preventBodyScroll(true);
  }
  function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    preventBodyScroll(false);
  }

  hamburger.addEventListener('click', openMobileNav);
  mobileClose.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(l => l.addEventListener('click', closeMobileNav));
})();

/* ════════════════════════════════════════
   SEARCH
════════════════════════════════════════ */
(function initSearch() {
  const toggle = $('#searchToggle');
  const bar = $('#searchBar');
  const input = $('#searchInput');
  const closeBtn = $('#searchClose');
  const results = $('#searchResults');

  function openSearch() {
    bar.classList.add('open');
    input.focus();
  }
  function closeSearch() {
    bar.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
  }

  toggle.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) return;

    const matches = LAARA_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      results.innerHTML = '<span class="search-result-item">No results found</span>';
      return;
    }
    matches.forEach(p => {
      const item = document.createElement('button');
      item.className = 'search-result-item';
      item.textContent = p.name;
      item.addEventListener('click', () => {
        closeSearch();
        openQuickView(p);
      });
      results.appendChild(item);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && bar.classList.contains('open')) closeSearch();
  });
})();

/* ════════════════════════════════════════
   CART
════════════════════════════════════════ */
function saveCart() {
  localStorage.setItem('laara_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const countEl = $('#cartCount');
  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);

  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  $('#cartSubtotal').textContent = fmt(total);

  const cartItems = $('#cartItems');
  const cartEmpty = $('#cartEmpty');
  const cartFooter = $('#cartFooter');

  if (state.cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartFooter.style.display = 'none';
    // Clear any rendered items
    $$('.cart-item', cartItems).forEach(el => el.remove());
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.style.display = 'flex';

  // Re-render all cart items
  $$('.cart-item', cartItems).forEach(el => el.remove());
  state.cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.cartId = item.cartId;
    div.innerHTML = `
      <div class="cart-item-color" style="background:${item.colorHex};"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.colorName} · Size ${item.size}</div>
        <div class="cart-item-price">${fmt(item.price * item.qty)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.cartId}">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.cartId}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.cartId}" aria-label="Remove from cart">×</button>
    `;
    cartItems.appendChild(div);
  });

  // Qty and remove events
  $$('.qty-btn', cartItems).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = state.cart.find(i => i.cartId === id);
      if (!item) return;
      if (btn.dataset.action === 'inc') item.qty++;
      else { item.qty--; if (item.qty <= 0) state.cart.splice(state.cart.indexOf(item), 1); }
      saveCart();
      updateCartUI();
    });
  });
  $$('.cart-item-remove', cartItems).forEach(btn => {
    btn.addEventListener('click', () => {
      state.cart = state.cart.filter(i => i.cartId !== btn.dataset.id);
      saveCart();
      updateCartUI();
      showToast('Item removed from cart');
    });
  });
}

function addToCart(product, size, colorIdx, qty = 1) {
  const color = product.colors[colorIdx] || product.colors[0];
  const cartId = `${product.id}-${size}-${colorIdx}`;
  const existing = state.cart.find(i => i.cartId === cartId);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({
      cartId,
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      colorName: color.name,
      colorHex: color.hex,
      qty,
    });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart! 🛍️`);
}

function openCart() {
  $('#cartDrawer').classList.add('open');
  $('#cartBackdrop').classList.add('visible');
  preventBodyScroll(true);
}
function closeCart() {
  $('#cartDrawer').classList.remove('open');
  $('#cartBackdrop').classList.remove('visible');
  preventBodyScroll(false);
}

window.closeCart = closeCart;

(function initCart() {
  $('#cartToggle').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartBackdrop').addEventListener('click', closeCart);
  $('#checkoutBtn').addEventListener('click', openCheckoutModal);
  updateCartUI();
})();

/* ════════════════════════════════════════
   PRODUCT GRID
════════════════════════════════════════ */
function getFilteredSortedProducts() {
  let list = [...LAARA_PRODUCTS];
  if (state.activeFilter !== 'all') {
    list = list.filter(p => p.category === state.activeFilter);
  }
  switch (state.sortBy) {
    case 'price-low':  list.sort((a, b) => a.price - b.price); break;
    case 'price-high': list.sort((a, b) => b.price - a.price); break;
    case 'new':        list.sort((a, b) => (a.badge === 'New' ? -1 : 1)); break;
  }
  return list;
}

function renderProductCard(p) {
  const discount = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return `
    <article class="product-card" data-product-id="${p.id}" data-category="${p.category}" role="article">
      <div class="product-img-wrap">
        <div class="product-color-bg" style="background:${p.bgGradient};">
          <span class="product-color-label">${p.name}</span>
        </div>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="product-quick-view-btn" data-product-id="${p.id}" aria-label="Quick view ${p.name}">
          Quick View
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${p.categoryLabel}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-pricing">
          <span class="product-price">${fmt(p.price)}</span>
          ${p.originalPrice ? `<span class="product-price-original">${fmt(p.originalPrice)}</span>` : ''}
          ${discount ? `<span class="product-price-tag">${discount}% OFF</span>` : ''}
        </div>
        <div class="product-colors">
          ${p.colors.map((c, i) =>
            `<button class="color-dot ${i === 0 ? 'active' : ''}"
              style="background:${c.hex};"
              title="${c.name}"
              aria-label="Color: ${c.name}"
              data-color-idx="${i}"
              data-product-id="${p.id}"></button>`
          ).join('')}
        </div>
        <div class="product-sizes">
          ${p.sizes.slice(0, 5).map((s, i) =>
            `<button class="size-chip ${i === 0 ? 'active' : ''}"
              data-size="${s}"
              data-product-id="${p.id}">${s}</button>`
          ).join('')}
          ${p.sizes.length > 5 ? `<span class="size-chip" style="opacity:.5;cursor:default;">+${p.sizes.length - 5}</span>` : ''}
        </div>
        <div class="product-card-actions">
          <button class="btn btn-primary quick-add-btn" data-product-id="${p.id}">Add to Cart</button>
          <button class="btn btn-outline" data-product-id="${p.id}" data-open-quick-view="true">Details</button>
        </div>
      </div>
    </article>
  `;
}

function renderProductGrid() {
  const grid = $('#productGrid');
  const products = getFilteredSortedProducts();

  if (products.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">No products found in this category.</p>';
    return;
  }

  grid.innerHTML = products.map(renderProductCard).join('');

  // Animate cards in with stagger
  const cards = $$('.product-card', grid);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
    io.observe(card);
  });

  bindProductCardEvents(grid);
}

function bindProductCardEvents(grid) {
  // Size chip selection
  grid.addEventListener('click', e => {
    const sizeChip = e.target.closest('.size-chip');
    if (sizeChip && sizeChip.dataset.productId) {
      const pid = sizeChip.dataset.productId;
      $$(`[data-product-id="${pid}"].size-chip`, grid).forEach(c => c.classList.remove('active'));
      sizeChip.classList.add('active');
    }

    // Color selection
    const colorDot = e.target.closest('.color-dot');
    if (colorDot && colorDot.dataset.productId) {
      const pid = colorDot.dataset.productId;
      $$(`[data-product-id="${pid}"].color-dot`, grid).forEach(c => c.classList.remove('active'));
      colorDot.classList.add('active');
    }

    // Quick add to cart
    const addBtn = e.target.closest('.quick-add-btn');
    if (addBtn && addBtn.dataset.productId) {
      const pid = parseInt(addBtn.dataset.productId);
      const product = LAARA_PRODUCTS.find(p => p.id === pid);
      if (!product) return;
      const card = addBtn.closest('.product-card');
      const activeSize = $('.size-chip.active', card);
      const activeColor = $('.color-dot.active', card);
      const size = activeSize ? activeSize.dataset.size : product.sizes[0];
      const colorIdx = activeColor ? parseInt(activeColor.dataset.colorIdx) : 0;
      addToCart(product, size, colorIdx);
    }

    // Quick view button (from img overlay)
    const quickViewBtn = e.target.closest('.product-quick-view-btn');
    if (quickViewBtn && quickViewBtn.dataset.productId) {
      const pid = parseInt(quickViewBtn.dataset.productId);
      const product = LAARA_PRODUCTS.find(p => p.id === pid);
      if (product) openQuickView(product);
    }

    // Details button
    const detailsBtn = e.target.closest('[data-open-quick-view="true"]');
    if (detailsBtn && detailsBtn.dataset.productId) {
      const pid = parseInt(detailsBtn.dataset.productId);
      const product = LAARA_PRODUCTS.find(p => p.id === pid);
      if (product) openQuickView(product);
    }
  });
}

(function initFilters() {
  const filterBtns = $$('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderProductGrid();
    });
  });

  $('#sortSelect').addEventListener('change', e => {
    state.sortBy = e.target.value;
    renderProductGrid();
  });

  renderProductGrid();
})();

/* ════════════════════════════════════════
   QUICK VIEW MODAL
════════════════════════════════════════ */
function openQuickView(product) {
  state.quickViewProduct = product;
  state.quickViewSize = product.sizes[0];
  state.quickViewColor = 0;
  state.modalQty = 1;

  const modal = $('#quickViewModal');
  const backdrop = $('#quickViewBackdrop');
  const inner = $('#modalInner');

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  inner.innerHTML = `
    <div class="modal-product-img-side">
      <div class="product-color-bg" style="background:${product.bgGradient}; min-height:420px;">
        <span class="product-color-label">${product.name}</span>
      </div>
    </div>
    <div class="modal-product-info-side">
      <div class="modal-product-category">${product.categoryLabel}</div>
      <h2 class="modal-product-name">${product.name}</h2>
      <div class="modal-product-pricing">
        <span class="modal-product-price">${fmt(product.price)}</span>
        ${product.originalPrice ? `<span class="product-price-original">${fmt(product.originalPrice)}</span>` : ''}
        ${discount ? `<span class="product-price-tag">${discount}% OFF</span>` : ''}
      </div>
      <p class="modal-product-desc">${product.description}</p>

      <label class="modal-select-label">Color</label>
      <div class="modal-colors">
        ${product.colors.map((c, i) => `
          <button class="modal-color-dot ${i === 0 ? 'active' : ''}"
            style="background:${c.hex};"
            title="${c.name}"
            data-color-idx="${i}"
            aria-label="${c.name}"></button>
        `).join('')}
      </div>

      <label class="modal-select-label">Size</label>
      <div class="modal-sizes">
        ${product.sizes.map((s, i) => `
          <button class="modal-size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
        `).join('')}
      </div>

      <div class="modal-qty-row">
        <span class="modal-qty-label">Qty</span>
        <div class="modal-qty-controls">
          <button class="modal-qty-btn" id="modalQtyDec">−</button>
          <span class="modal-qty-val" id="modalQtyVal">1</span>
          <button class="modal-qty-btn" id="modalQtyInc">+</button>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-primary" id="modalAddToCart">Add to Cart</button>
        <button class="btn btn-outline" onclick="openWhatsApp('${encodeURIComponent(product.name)}')">Enquire via WhatsApp</button>
      </div>

      <div class="modal-features">
        ${product.features.map(f => `
          <div class="modal-feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${f}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Size selection
  $$('.modal-size-btn', inner).forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.modal-size-btn', inner).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.quickViewSize = btn.dataset.size;
    });
  });

  // Color selection
  $$('.modal-color-dot', inner).forEach(dot => {
    dot.addEventListener('click', () => {
      $$('.modal-color-dot', inner).forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      state.quickViewColor = parseInt(dot.dataset.colorIdx);
    });
  });

  // Qty controls
  $('#modalQtyDec').addEventListener('click', () => {
    if (state.modalQty > 1) state.modalQty--;
    $('#modalQtyVal').textContent = state.modalQty;
  });
  $('#modalQtyInc').addEventListener('click', () => {
    state.modalQty++;
    $('#modalQtyVal').textContent = state.modalQty;
  });

  // Add to cart from modal
  $('#modalAddToCart').addEventListener('click', () => {
    addToCart(product, state.quickViewSize, state.quickViewColor, state.modalQty);
    closeQuickView();
    openCart();
  });

  modal.showModal();
  backdrop.classList.add('visible');
  preventBodyScroll(true);
}

function closeQuickView() {
  const modal = $('#quickViewModal');
  const backdrop = $('#quickViewBackdrop');
  modal.close();
  backdrop.classList.remove('visible');
  preventBodyScroll(false);
}

(function initQuickView() {
  $('#modalClose').addEventListener('click', closeQuickView);
  $('#quickViewBackdrop').addEventListener('click', closeQuickView);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeQuickView();
  });
})();

/* ════════════════════════════════════════
   REVIEWS CAROUSEL
════════════════════════════════════════ */
(function initReviews() {
  const track = $('#reviewsTrack');
  const dotsContainer = $('#reviewsDots');
  const prevBtn = $('#revPrev');
  const nextBtn = $('#revNext');

  // Render review cards
  track.innerHTML = LAARA_REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-stars">${stars(r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar" style="background:${r.avatarBg};">${r.initial}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-loc">${r.location}</div>
        </div>
      </div>
      <span class="review-quote-mark">"</span>
    </div>
  `).join('');

  function getVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function maxIndex() { return Math.max(0, LAARA_REVIEWS.length - getVisible()); }

  function goTo(idx) {
    state.reviewIndex = Math.max(0, Math.min(idx, maxIndex()));
    const cardW = track.firstElementChild?.offsetWidth + 24 || 0;
    track.style.transform = `translateX(-${state.reviewIndex * cardW}px)`;
    updateDots();
  }

  function updateDots() {
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = `review-dot ${i === state.reviewIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  prevBtn.addEventListener('click', () => goTo(state.reviewIndex - 1));
  nextBtn.addEventListener('click', () => goTo(state.reviewIndex + 1));

  window.addEventListener('resize', () => goTo(state.reviewIndex));

  updateDots();
  goTo(0);

  // Auto-play
  let autoPlay = setInterval(() => {
    const next = state.reviewIndex >= maxIndex() ? 0 : state.reviewIndex + 1;
    goTo(next);
  }, 4500);

  track.closest('.reviews-track-wrap').addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.closest('.reviews-track-wrap').addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      const next = state.reviewIndex >= maxIndex() ? 0 : state.reviewIndex + 1;
      goTo(next);
    }, 4500);
  });
})();

/* ════════════════════════════════════════
   CHECKOUT MODAL
════════════════════════════════════════ */
function openCheckoutModal() {
  closeCart();
  const modal = $('#checkoutModal');
  const backdrop = $('#checkoutBackdrop');
  modal.showModal();
  backdrop.classList.add('visible');
  preventBodyScroll(true);
}

(function initCheckoutModal() {
  $('#checkoutModalClose').addEventListener('click', () => {
    $('#checkoutModal').close();
    $('#checkoutBackdrop').classList.remove('visible');
    preventBodyScroll(false);
  });
  $('#checkoutBackdrop').addEventListener('click', () => {
    $('#checkoutModal').close();
    $('#checkoutBackdrop').classList.remove('visible');
    preventBodyScroll(false);
  });
})();

/* ════════════════════════════════════════
   POLICY MODALS
════════════════════════════════════════ */
function openPolicyModal(key) {
  const data = LAARA_POLICIES[key];
  if (!data) return;
  const modal = $('#policyModal');
  const backdrop = $('#policyBackdrop');
  const content = $('#policyModalContent');

  content.innerHTML = `
    <h2>${data.title}</h2>
    ${data.sections.map(s => `
      <h3>${s.heading}</h3>
      <p>${s.body}</p>
    `).join('')}
  `;

  modal.showModal();
  backdrop.classList.add('visible');
  preventBodyScroll(true);
}

(function initPolicyModals() {
  $('#policyModalClose').addEventListener('click', () => {
    $('#policyModal').close();
    $('#policyBackdrop').classList.remove('visible');
    preventBodyScroll(false);
  });
  $('#policyBackdrop').addEventListener('click', () => {
    $('#policyModal').close();
    $('#policyBackdrop').classList.remove('visible');
    preventBodyScroll(false);
  });

  $('#privacyLink').addEventListener('click', e => { e.preventDefault(); openPolicyModal('privacy'); });
  $('#shippingLink').addEventListener('click', e => { e.preventDefault(); openPolicyModal('shipping'); });
  $('#returnLink').addEventListener('click', e => { e.preventDefault(); openPolicyModal('return'); });
})();

/* ════════════════════════════════════════
   WHATSAPP
════════════════════════════════════════ */
function openWhatsApp(productName) {
  const phone = ''; // ← Add your WhatsApp number here (e.g. '919876543210')
  const cartSummary = state.cart.map(i =>
    `• ${i.name} (${i.colorName}, Size ${i.size}) × ${i.qty} = ${fmt(i.price * i.qty)}`
  ).join('\n');

  let msg;
  if (productName) {
    msg = `Hi LAARA! I'm interested in: ${decodeURIComponent(productName)}. Can you share more details?`;
  } else if (state.cart.length > 0) {
    const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    msg = `Hi LAARA! I'd like to order:\n\n${cartSummary}\n\nTotal: ${fmt(total)}\n\nCould you help me complete my order?`;
  } else {
    msg = `Hi LAARA! I'm interested in your leggings. Could you share more details?`;
  }

  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

window.openWhatsApp = openWhatsApp;

/* ════════════════════════════════════════
   SMOOTH SCROLL FOR ANCHOR LINKS
════════════════════════════════════════ */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const offset = target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: offset, behavior: 'smooth' });
});

/* ════════════════════════════════════════
   RE-RUN REVEAL ON DYNAMIC CONTENT
════════════════════════════════════════ */
function reObserveReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal:not(.visible)').forEach(el => io.observe(el));
}
setTimeout(reObserveReveals, 400);
