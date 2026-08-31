// Repostisur Storefront Application Logic (with Cloud Sync & Realtime)

document.addEventListener('DOMContentLoaded', async () => {
  // Sync latest data from Supabase Cloud (if connected)
  await RepostisurStorage.syncFromCloud();

  // Initialize BCV Rate
  await initBCVRate();

  // Initial Render
  renderStorefront();
  updateCartBadge();

  // Setup Event Listeners
  setupCategoryFilters();
  setupSearchInput();
  setupCartDrawer();
  setupCheckoutModal();

  // Listen to Realtime updates from Supabase Cloud
  window.addEventListener('repostisur_data_updated', async () => {
    console.log('🔄 Datos actualizados en la nube. Re-renderizando tienda...');
    await initBCVRate();
    renderStorefront();
    renderCartContents();
  });
});

let currentCategory = 'all';
let searchQuery = '';

async function initBCVRate() {
  const rateInfo = await BCVService.fetchOfficialRate();
  const rateDisplayEl = document.getElementById('bcv-rate-text');
  
  if (rateDisplayEl) {
    rateDisplayEl.textContent = `1 USD = Bs. ${rateInfo.rate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function renderStorefront() {
  renderFeaturedProducts();
  renderCatalogProducts();
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  const products = RepostisurStorage.getProducts().filter(p => p.featured && p.stock > 0);
  
  if (products.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-on-surface-variant py-8">No hay productos destacados en este momento.</p>`;
    return;
  }

  container.innerHTML = products.map(product => {
    const priceInfo = BCVService.formatPriceDisplay(product.priceUSD);
    const badgeHtml = product.badge ? `
      <div class="absolute top-sm right-sm z-10 ${product.badge.toLowerCase() === 'oferta' ? 'bg-tertiary text-on-tertiary' : 'bg-secondary text-on-secondary'} font-label-sm text-label-sm px-sm py-xs rounded-full font-bold shadow-sm">
        ${product.badge}
      </div>` : '';

    return `
      <div class="group relative bg-surface border border-surface-variant rounded-xl overflow-hidden hover:shadow-[0_4px_16px_rgba(0,71,171,0.12)] transition-all duration-300 flex flex-col h-full">
        ${badgeHtml}
        <div class="aspect-square w-full bg-surface-container-low overflow-hidden relative">
          <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               src="${product.image || 'https://via.placeholder.com/400x400?text=Insumos'}" 
               alt="${product.name}" 
               loading="lazy">
        </div>
        <div class="p-md flex flex-col flex-grow">
          <h3 class="font-headline-md text-headline-md text-on-surface mb-xs group-hover:text-primary transition-colors">${product.name}</h3>
          <span class="font-label-sm text-label-sm text-on-surface-variant mb-md">${product.unit} • ${product.categoryName || product.category}</span>
          <div class="mt-auto flex justify-between items-center pt-2 border-t border-surface-variant/50">
            <div>
              <span class="font-price-display text-price-display text-on-surface block font-bold">${priceInfo.bsFormatted}</span>
              <span class="text-xs text-on-surface-variant font-medium">Ref. ${priceInfo.usdFormatted}</span>
            </div>
            <button onclick="handleAddToCart('${product.id}')" class="bg-primary-container text-on-primary-container p-sm rounded-full hover:bg-primary hover:text-on-primary transition-all duration-200 active:scale-90 shadow-sm" title="Agregar al carrito">
              <span class="material-symbols-outlined text-[20px]" data-icon="add_shopping_cart">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderCatalogProducts() {
  const container = document.getElementById('catalog-products-grid');
  if (!container) return;

  let products = RepostisurStorage.getProducts();

  // Filter by category
  if (currentCategory !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
  }

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }

  const resultsCount = document.getElementById('catalog-results-count');
  if (resultsCount) {
    resultsCount.textContent = `${products.length} producto${products.length === 1 ? '' : 's'} disponible${products.length === 1 ? '' : 's'}`;
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-surface-container-low rounded-xl border border-outline-variant">
        <span class="material-symbols-outlined text-outline text-5xl mb-2">search_off</span>
        <h4 class="font-headline-md text-headline-md text-on-surface mb-1">No se encontraron productos</h4>
        <p class="text-on-surface-variant text-sm">Prueba buscando con otra palabra o categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const priceInfo = BCVService.formatPriceDisplay(product.priceUSD);
    const isOutOfStock = product.stock <= 0;
    
    let badgeHtml = '';
    if (isOutOfStock) {
      badgeHtml = `<div class="absolute top-sm right-sm z-10 bg-error text-on-error font-label-sm text-label-sm px-sm py-xs rounded-full font-bold">Agotado</div>`;
    } else if (product.badge) {
      badgeHtml = `<div class="absolute top-sm right-sm z-10 ${product.badge.toLowerCase() === 'oferta' ? 'bg-tertiary text-on-tertiary' : 'bg-secondary text-on-secondary'} font-label-sm text-label-sm px-sm py-xs rounded-full font-bold">${product.badge}</div>`;
    }

    return `
      <div class="group relative bg-surface border border-surface-variant rounded-xl overflow-hidden hover:shadow-[0_4px_16px_rgba(0,71,171,0.12)] transition-all duration-300 flex flex-col h-full">
        ${badgeHtml}
        <div class="aspect-square w-full bg-surface-container-low overflow-hidden relative">
          <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'opacity-50 grayscale' : ''}" 
               src="${product.image || 'https://via.placeholder.com/400x400?text=Insumos'}" 
               alt="${product.name}" 
               loading="lazy">
        </div>
        <div class="p-md flex flex-col flex-grow">
          <span class="text-xs font-semibold text-primary uppercase tracking-wider mb-1">${product.categoryName || product.category}</span>
          <h3 class="font-headline-md text-headline-md text-on-surface mb-xs font-semibold leading-snug">${product.name}</h3>
          <p class="text-xs text-on-surface-variant line-clamp-2 mb-md">${product.description || ''}</p>
          <span class="font-label-sm text-label-sm text-on-surface-variant mb-sm">${product.unit} • Stock: ${product.stock} un</span>
          
          <div class="mt-auto flex justify-between items-center pt-2 border-t border-surface-variant/50">
            <div>
              <span class="font-price-display text-price-display text-on-surface block font-bold">${priceInfo.bsFormatted}</span>
              <span class="text-xs text-on-surface-variant font-medium">Ref. ${priceInfo.usdFormatted}</span>
            </div>
            ${isOutOfStock ? `
              <span class="text-xs font-bold text-error bg-error-container px-3 py-1.5 rounded-full">Sin stock</span>
            ` : `
              <button onclick="handleAddToCart('${product.id}')" class="bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary p-sm rounded-full transition-all duration-200 active:scale-90 shadow-sm flex items-center justify-center" title="Agregar al carrito">
                <span class="material-symbols-outlined text-[20px]" data-icon="add_shopping_cart">add_shopping_cart</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll('.category-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'border-transparent');
        b.classList.add('bg-transparent', 'text-on-surface-variant', 'border-outline-variant');
      });
      btn.classList.remove('bg-transparent', 'text-on-surface-variant', 'border-outline-variant');
      btn.classList.add('bg-secondary-container', 'text-on-secondary-container', 'border-transparent');
      
      currentCategory = btn.dataset.category || 'all';
      renderCatalogProducts();
    });
  });
}

function setupSearchInput() {
  const searchInput = document.getElementById('search-products-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalogProducts();
    });
  }
}

function handleAddToCart(productId) {
  RepostisurStorage.addToCart(productId, 1);
  updateCartBadge();
  showToastNotification('¡Producto añadido al carrito!');
}

function updateCartBadge() {
  const cart = RepostisurStorage.getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(badge => {
    badge.textContent = totalItems;
    if (totalItems > 0) {
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  });
}

// Cart Drawer
function setupCartDrawer() {
  const cartToggleButtons = document.querySelectorAll('.cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');

  const openCart = () => {
    renderCartContents();
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('translate-x-full');
      cartOverlay.classList.remove('hidden');
    }
  };

  const closeCart = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('translate-x-full');
      cartOverlay.classList.add('hidden');
    }
  };

  cartToggleButtons.forEach(btn => btn.addEventListener('click', openCart));
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
}

function renderCartContents() {
  const cartList = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const summarySection = document.getElementById('cart-summary-section');
  const subtotalBsEl = document.getElementById('cart-subtotal-bs');
  const subtotalUsdEl = document.getElementById('cart-subtotal-usd');
  const totalBsEl = document.getElementById('cart-total-bs');
  const totalUsdEl = document.getElementById('cart-total-usd');

  const cart = RepostisurStorage.getCart();

  if (cart.length === 0) {
    if (cartList) cartList.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (summarySection) summarySection.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (summarySection) summarySection.classList.remove('hidden');

  let totalUSD = 0;

  if (cartList) {
    cartList.innerHTML = cart.map(item => {
      const itemTotalUSD = item.priceUSD * item.quantity;
      totalUSD += itemTotalUSD;
      const priceInfo = BCVService.formatPriceDisplay(item.priceUSD);
      const itemTotalInfo = BCVService.formatPriceDisplay(itemTotalUSD);

      return `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex gap-3 items-center relative group">
          <div class="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-surface-container-high rounded-md overflow-hidden">
            <img class="w-full h-full object-cover" src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
          </div>
          <div class="flex-grow min-w-0">
            <h4 class="font-headline-md text-sm font-semibold text-on-surface truncate">${item.name}</h4>
            <p class="font-label-sm text-xs text-on-surface-variant">${item.unit} • ${priceInfo.bsFormatted} (${priceInfo.usdFormatted})</p>
            <div class="mt-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button onclick="handleUpdateCartQty('${item.id}', ${item.quantity - 1})" class="w-7 h-7 rounded-full border border-outline flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">
                  <span class="material-symbols-outlined text-xs">remove</span>
                </button>
                <span class="font-body-md text-sm font-bold w-6 text-center">${item.quantity}</span>
                <button onclick="handleUpdateCartQty('${item.id}', ${item.quantity + 1})" class="w-7 h-7 rounded-full border border-outline flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">
                  <span class="material-symbols-outlined text-xs">add</span>
                </button>
              </div>
              <span class="font-price-display text-sm font-bold text-primary">${itemTotalInfo.bsFormatted}</span>
            </div>
          </div>
          <button onclick="handleRemoveCartItem('${item.id}')" class="text-on-surface-variant hover:text-error transition-colors p-1" title="Eliminar">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      `;
    }).join('');
  }

  const totalBs = BCVService.calculateBs(totalUSD);
  const totalBsFormatted = BCVService.formatBs(totalBs);
  const totalUSDFormatted = BCVService.formatUSD(totalUSD);

  if (subtotalBsEl) subtotalBsEl.textContent = totalBsFormatted;
  if (subtotalUsdEl) subtotalUsdEl.textContent = totalUSDFormatted;
  if (totalBsEl) totalBsEl.textContent = totalBsFormatted;
  if (totalUsdEl) totalUsdEl.textContent = totalUSDFormatted;
}

function handleUpdateCartQty(productId, newQty) {
  RepostisurStorage.updateCartQuantity(productId, newQty);
  updateCartBadge();
  renderCartContents();
}

function handleRemoveCartItem(productId) {
  RepostisurStorage.updateCartQuantity(productId, 0);
  updateCartBadge();
  renderCartContents();
}

// WhatsApp Checkout Modal
function setupCheckoutModal() {
  const openCheckoutBtn = document.getElementById('open-checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');

  if (openCheckoutBtn && checkoutModal) {
    openCheckoutBtn.addEventListener('click', () => {
      const cart = RepostisurStorage.getCart();
      if (cart.length === 0) {
        showToastNotification('Tu carrito está vacío');
        return;
      }
      checkoutModal.classList.remove('hidden');
    });
  }

  if (closeCheckoutBtn && checkoutModal) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.add('hidden');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendOrderToWhatsApp();
    });
  }
}

function sendOrderToWhatsApp() {
  const cart = RepostisurStorage.getCart();
  if (cart.length === 0) return;

  const settings = RepostisurStorage.getSettings();
  const currentRate = BCVService.getCurrentRate();

  const customerName = document.getElementById('order-customer-name')?.value || 'Cliente';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'Retiro en Tienda';
  const deliveryAddress = document.getElementById('order-delivery-address')?.value || '';
  const paymentMethod = document.getElementById('order-payment-method')?.value || 'Pago Móvil';
  const notes = document.getElementById('order-notes')?.value || '';

  let totalUSD = 0;
  let itemsText = '';

  cart.forEach((item) => {
    const itemTotalUSD = item.priceUSD * item.quantity;
    totalUSD += itemTotalUSD;
    const itemTotalBs = BCVService.calculateBs(itemTotalUSD);
    const itemBsFormatted = BCVService.formatBs(itemTotalBs);
    const itemUsdFormatted = BCVService.formatUSD(itemTotalUSD);

    itemsText += `• ${item.quantity}x ${item.name} (${item.unit}) — ${itemBsFormatted} (${itemUsdFormatted})\n`;
  });

  const totalBs = BCVService.calculateBs(totalUSD);
  const totalBsFormatted = BCVService.formatBs(totalBs);
  const totalUSDFormatted = BCVService.formatUSD(totalUSD);
  const rateFormatted = Number(currentRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let message = `🧁 *NUEVO PEDIDO - ${settings.storeName.toUpperCase()}* 🧁\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Cliente:* ${customerName}\n`;
  message += `📍 *Modalidad:* ${deliveryType}\n`;
  if (deliveryType.toLowerCase().includes('delivery') && deliveryAddress.trim()) {
    message += `🏠 *Dirección:* ${deliveryAddress}\n`;
  }
  message += `💳 *Método de Pago:* ${paymentMethod}\n`;
  if (notes.trim()) {
    message += `📝 *Nota:* ${notes}\n`;
  }
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🛒 *DETALLE DEL PEDIDO:*\n\n`;
  message += itemsText;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL A PAGAR:* ${totalBsFormatted} (${totalUSDFormatted})\n`;
  message += `ℹ️ *Tasa Oficial BCV aplicada:* ${rateFormatted} Bs/$\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `¿Podrían confirmarme la disponibilidad para procesar mi pago? ¡Muchas gracias!`;

  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '') || '584121234567';
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  RepostisurStorage.clearCart();
  updateCartBadge();
  renderCartContents();

  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) checkoutModal.classList.add('hidden');

  window.open(waUrl, '_blank');
}

function showToastNotification(text) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-5 py-3 rounded-full shadow-2xl z-50 text-sm font-semibold flex items-center gap-2 transition-all duration-300 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-[18px] text-primary-container">check_circle</span> ${text}`;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2500);
}
