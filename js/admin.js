// Repostisur Admin Panel Logic (PWA & Desktop with Supabase Cloud Sync & Realtime)

document.addEventListener('DOMContentLoaded', async () => {
  // Check PIN Authentication
  initAuthGuard();

  // Sync latest data from Supabase Cloud
  await RepostisurStorage.syncFromCloud();

  // Check and display BCV rate
  await loadBCVSettings();

  // Render POS Price Checker, Dashboard & Inventory
  renderPriceChecker();
  renderAdminDashboard();
  renderAdminProductsTable();

  // Setup Listeners
  setupAdminNavigation();
  setupProductModal();
  setupSettingsHandlers();
  setupAdminSearch();
  setupPriceCheckerListeners();

  // Listen to Realtime updates from Supabase Cloud
  window.addEventListener('repostisur_data_updated', async () => {
    console.log('🔄 Datos sincronizados en tiempo real.');
    await loadBCVSettings();
    renderPriceChecker();
    renderAdminDashboard();
    renderAdminProductsTable();
  });
});

let adminCurrentCategory = 'all';
let adminSearchQuery = '';
let checkerCurrentCategory = 'all';
let checkerSearchQuery = '';

// Auth Guard & PIN Login
function initAuthGuard() {
  const lockScreen = document.getElementById('auth-lock-screen');
  const pinForm = document.getElementById('pin-login-form');
  const pinInput = document.getElementById('pin-input');
  const pinError = document.getElementById('pin-error-msg');
  const lockBtn = document.getElementById('lock-admin-btn');
  const lockMobileBtn = document.getElementById('lock-admin-mobile-btn');

  const isAuthenticated = RepostisurStorage.isAdminAuthenticated();

  if (isAuthenticated && lockScreen) {
    lockScreen.classList.add('hidden');
  } else if (lockScreen) {
    lockScreen.classList.remove('hidden');
    if (pinInput) setTimeout(() => pinInput.focus(), 150);
  }

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = pinInput.value.trim();
      if (RepostisurStorage.verifyPin(enteredPin)) {
        RepostisurStorage.setAdminAuthenticated(true);
        if (pinError) pinError.classList.add('hidden');
        if (lockScreen) lockScreen.classList.add('hidden');
        pinForm.reset();
        showAdminToast('¡Panel Desbloqueado!');
      } else {
        if (pinError) pinError.classList.remove('hidden');
        pinInput.value = '';
        pinInput.focus();
      }
    });
  }

  const handleLock = () => {
    RepostisurStorage.setAdminAuthenticated(false);
    if (lockScreen) {
      lockScreen.classList.remove('hidden');
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  };

  if (lockBtn) lockBtn.addEventListener('click', handleLock);
  if (lockMobileBtn) lockMobileBtn.addEventListener('click', handleLock);
}

async function loadBCVSettings() {
  const settings = RepostisurStorage.getSettings();
  const rateInfo = await BCVService.fetchOfficialRate();

  const bcvRateDisplay = document.getElementById('admin-bcv-display');
  const checkerBcvRate = document.getElementById('checker-bcv-rate');
  const bcvMobileBadge = document.getElementById('admin-bcv-badge-mobile');
  const bcvModeToggle = document.getElementById('bcv-mode-toggle');
  const manualRateInput = document.getElementById('bcv-manual-rate-input');
  const manualRateContainer = document.getElementById('manual-rate-container');
  const storePhoneInput = document.getElementById('store-phone-input');

  const supabaseUrlInput = document.getElementById('supabase-url-input');
  const supabaseKeyInput = document.getElementById('supabase-key-input');
  const supabaseStatusBadge = document.getElementById('supabase-status-badge');

  const rateFormatted = `Bs. ${Number(rateInfo.rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (bcvRateDisplay) bcvRateDisplay.textContent = rateFormatted;
  if (checkerBcvRate) checkerBcvRate.textContent = rateFormatted;
  if (bcvMobileBadge) bcvMobileBadge.textContent = rateFormatted;

  if (bcvModeToggle) bcvModeToggle.checked = settings.bcvMode === 'auto';
  if (manualRateInput) manualRateInput.value = settings.manualRate || rateInfo.rate;
  if (manualRateContainer) manualRateContainer.style.display = settings.bcvMode === 'manual' ? 'block' : 'none';
  if (storePhoneInput) storePhoneInput.value = settings.whatsappNumber || '584121234567';

  // Supabase status
  const sbConfig = SupabaseManager.getConfig();
  if (supabaseUrlInput) supabaseUrlInput.value = sbConfig.url;
  if (supabaseKeyInput) supabaseKeyInput.value = sbConfig.anonKey;
  if (supabaseStatusBadge) {
    if (SupabaseManager.isConfigured()) {
      supabaseStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#137333]"></span> Conectado a Supabase Cloud`;
      supabaseStatusBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] text-[#137333] text-xs font-bold';
    } else {
      supabaseStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#F29900]"></span> Modo Local (Sin Supabase)`;
      supabaseStatusBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF7E0] text-[#B06000] text-xs font-bold';
    }
  }
}

// -------------------------------------------------------------
// POS PRICE CHECKER (CONSULTOR DE PRECIOS PARA VENDEDORES)
// -------------------------------------------------------------
function renderPriceChecker() {
  const grid = document.getElementById('checker-results-grid');
  if (!grid) return;

  let products = RepostisurStorage.getProducts();

  // Category filter
  if (checkerCurrentCategory !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === checkerCurrentCategory.toLowerCase());
  }

  // Search query filter
  if (checkerSearchQuery.trim()) {
    const q = checkerSearchQuery.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-10 text-center text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl mb-2 text-outline-variant">search_off</span>
        <h4 class="font-headline-md text-lg font-bold text-on-surface">Insumo no encontrado</h4>
        <p class="text-xs mt-1">Prueba escribiendo otra palabra (ej. cacao, vaso, pudín).</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => {
    const priceInfo = BCVService.formatPriceDisplay(product.priceUSD);
    const isOut = product.stock <= 0;
    const isLow = product.stock > 0 && product.stock <= 15;

    let stockTag = '';
    if (isOut) {
      stockTag = `<span class="bg-error text-on-error text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-white"></span> AGOTADO (0)</span>`;
    } else if (isLow) {
      stockTag = `<span class="bg-[#FEF7E0] text-[#B06000] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#F29900]"></span> Stock Bajo (${product.stock} un)</span>`;
    } else {
      stockTag = `<span class="bg-[#E6F4EA] text-[#137333] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#137333]"></span> ${product.stock} disponibles</span>`;
    }

    return `
      <div class="bg-surface-container-lowest border-2 ${isOut ? 'border-outline-variant/60 opacity-75' : 'border-outline-variant hover:border-secondary'} rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-2 mb-3">
            <span class="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-container/40 px-2.5 py-0.5 rounded-md">
              ${product.categoryName || product.category}
            </span>
            ${stockTag}
          </div>

          <div class="flex gap-3 items-center mb-4">
            <div class="w-14 h-14 rounded-xl bg-surface-variant flex-shrink-0 bg-cover bg-center border border-outline-variant overflow-hidden"
                 style="background-image: url('${product.image || 'https://via.placeholder.com/150'}')">
            </div>
            <div>
              <h3 class="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-tight">${product.name}</h3>
              <p class="text-xs text-on-surface-variant mt-0.5 font-medium">Presentación: <strong>${product.unit}</strong></p>
            </div>
          </div>
        </div>

        <!-- Big Highlighted Prices -->
        <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50 mt-2">
          <div class="flex justify-between items-baseline">
            <span class="text-xs font-bold text-on-surface-variant uppercase">Precio en Bolívares:</span>
            <span class="font-price-display text-2xl font-black text-primary">${priceInfo.bsFormatted}</span>
          </div>
          <div class="flex justify-between items-center mt-1 pt-1.5 border-t border-outline-variant/40 text-xs">
            <span class="text-on-surface-variant">Precio Base USD:</span>
            <span class="font-bold text-on-surface">${priceInfo.usdFormatted} USD</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupPriceCheckerListeners() {
  const searchInput = document.getElementById('checker-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      checkerSearchQuery = e.target.value;
      renderPriceChecker();
    });
  }

  const catChips = document.querySelectorAll('.checker-cat-chip');
  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      catChips.forEach(c => {
        c.classList.remove('bg-secondary', 'text-on-secondary');
        c.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      chip.classList.remove('bg-surface-container', 'text-on-surface-variant');
      chip.classList.add('bg-secondary', 'text-on-secondary');

      checkerCurrentCategory = chip.dataset.cat || 'all';
      renderPriceChecker();
    });
  });
}

// -------------------------------------------------------------
// DASHBOARD & INVENTORY
// -------------------------------------------------------------
function renderAdminDashboard() {
  const products = RepostisurStorage.getProducts();
  const currentRate = BCVService.getCurrentRate();

  const totalProductsEl = document.getElementById('stat-total-products');
  if (totalProductsEl) totalProductsEl.textContent = products.length;

  const lowStockCount = products.filter(p => p.stock <= 15).length;
  const lowStockEl = document.getElementById('stat-low-stock');
  if (lowStockEl) lowStockEl.textContent = lowStockCount;

  const bcvStatEl = document.getElementById('stat-bcv-rate');
  if (bcvStatEl) {
    bcvStatEl.textContent = `Bs. ${Number(currentRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function renderAdminProductsTable() {
  const tableBody = document.getElementById('admin-products-table-body');
  if (!tableBody) return;

  let products = RepostisurStorage.getProducts();

  if (adminCurrentCategory !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === adminCurrentCategory.toLowerCase());
  }

  if (adminSearchQuery.trim()) {
    const q = adminSearchQuery.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="p-8 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-2">inventory_2</span>
          <p>No se encontraron productos registrados.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = products.map(product => {
    const priceInfo = BCVService.formatPriceDisplay(product.priceUSD);
    
    let stockBadge = '';
    if (product.stock === 0) {
      stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FCE8E6] text-[#C5221F] font-label-sm text-xs font-semibold"><span class="w-2 h-2 rounded-full bg-[#D93025]"></span> Agotado (0)</span>`;
    } else if (product.stock <= 15) {
      stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF7E0] text-[#B06000] font-label-sm text-xs font-semibold"><span class="w-2 h-2 rounded-full bg-[#F29900]"></span> Bajo (${product.stock})</span>`;
    } else {
      stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#137333] font-label-sm text-xs font-semibold"><span class="w-2 h-2 rounded-full bg-[#137333]"></span> ${product.stock} un</span>`;
    }

    return `
      <tr class="hover:bg-surface-container-low transition-colors group">
        <td class="p-4 flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-surface-variant flex-shrink-0 bg-cover bg-center border border-outline-variant overflow-hidden" 
               style="background-image: url('${product.image || 'https://via.placeholder.com/150'}')">
          </div>
          <div>
            <p class="font-semibold text-on-surface text-sm sm:text-base">${product.name}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="font-label-sm text-xs text-on-surface-variant">ID: ${product.id}</span>
              <span class="font-label-sm text-xs text-on-surface-variant">• ${product.unit}</span>
              ${product.featured ? '<span class="bg-primary-container text-on-primary-container text-[10px] font-bold px-1.5 py-0.5 rounded">Destacado</span>' : ''}
            </div>
          </div>
        </td>
        <td class="p-4">
          <span class="inline-block px-2.5 py-1 bg-surface-container rounded-full text-xs font-medium uppercase tracking-wider text-on-surface">
            ${product.categoryName || product.category}
          </span>
        </td>
        <td class="p-4">
          ${stockBadge}
        </td>
        <td class="p-4 text-right">
          <span class="font-price-display text-base font-bold text-on-surface block">${priceInfo.bsFormatted}</span>
          <span class="text-xs text-on-surface-variant font-medium">Ref. ${priceInfo.usdFormatted}</span>
        </td>
        <td class="p-4 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick="handleEditProduct('${product.id}')" class="text-secondary hover:bg-secondary-container hover:text-on-secondary-container p-2 rounded-full transition-colors" title="Editar Producto">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button onclick="handleDeleteProduct('${product.id}')" class="text-error hover:bg-error-container hover:text-on-error-container p-2 rounded-full transition-colors" title="Eliminar Producto">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function setupAdminSearch() {
  const searchInput = document.getElementById('admin-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      adminSearchQuery = e.target.value;
      renderAdminProductsTable();
    });
  }

  const categoryBtns = document.querySelectorAll('.admin-cat-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'border-transparent');
        b.classList.add('bg-transparent', 'text-on-surface-variant', 'border-outline-variant');
      });
      btn.classList.remove('bg-transparent', 'text-on-surface-variant', 'border-outline-variant');
      btn.classList.add('bg-secondary-container', 'text-on-secondary-container', 'border-transparent');
      
      adminCurrentCategory = btn.dataset.category || 'all';
      renderAdminProductsTable();
    });
  });
}

function setupProductModal() {
  const modal = document.getElementById('product-modal');
  const addBtn = document.getElementById('open-add-product-btn');
  const closeBtn = document.getElementById('close-product-modal-btn');
  const form = document.getElementById('product-form');
  const fileInput = document.getElementById('prod-image-file');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      document.getElementById('modal-product-id').value = '';
      document.getElementById('modal-title').textContent = 'Añadir Nuevo Producto';
      form.reset();
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        showAdminToast('Subiendo imagen a Supabase...');
        const uploadedUrl = await RepostisurStorage.uploadImage(file);
        if (uploadedUrl) {
          document.getElementById('prod-image').value = uploadedUrl;
          showAdminToast('¡Imagen subida correctamente!');
        }
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveProductFromModal();
    });
  }
}

function handleEditProduct(productId) {
  const product = RepostisurStorage.getProductById(productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  document.getElementById('modal-product-id').value = product.id;
  document.getElementById('modal-title').textContent = 'Editar Producto';

  document.getElementById('prod-name').value = product.name;
  document.getElementById('prod-category').value = product.category;
  document.getElementById('prod-price-usd').value = product.priceUSD;
  document.getElementById('prod-unit').value = product.unit;
  document.getElementById('prod-stock').value = product.stock;
  document.getElementById('prod-image').value = product.image || '';
  document.getElementById('prod-badge').value = product.badge || '';
  document.getElementById('prod-featured').checked = !!product.featured;
  document.getElementById('prod-description').value = product.description || '';

  modal.classList.remove('hidden');
}

async function saveProductFromModal() {
  const id = document.getElementById('modal-product-id').value;
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const priceUSD = parseFloat(document.getElementById('prod-price-usd').value) || 0;
  const unit = document.getElementById('prod-unit').value.trim() || '1 unidad';
  const stock = parseInt(document.getElementById('prod-stock').value, 10) || 0;
  const image = document.getElementById('prod-image').value.trim();
  const badge = document.getElementById('prod-badge').value.trim();
  const featured = document.getElementById('prod-featured').checked;
  const description = document.getElementById('prod-description').value.trim();

  const categoryNames = {
    cacao: 'Cacao',
    desechables: 'Desechables',
    pudines: 'Pudines',
    reposteria: 'Otros Insumos'
  };

  const productData = {
    id: id || undefined,
    name,
    category,
    categoryName: categoryNames[category] || category,
    priceUSD,
    unit,
    stock,
    status: stock === 0 ? 'out_of_stock' : stock <= 15 ? 'low_stock' : 'active',
    image: image || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(name),
    badge,
    featured,
    description
  };

  await RepostisurStorage.saveProduct(productData);

  document.getElementById('product-modal').classList.add('hidden');
  renderPriceChecker();
  renderAdminDashboard();
  renderAdminProductsTable();
  showAdminToast('¡Producto guardado exitosamente en la nube!');
}

async function handleDeleteProduct(productId) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto del catálogo?')) {
    await RepostisurStorage.deleteProduct(productId);
    renderPriceChecker();
    renderAdminDashboard();
    renderAdminProductsTable();
    showAdminToast('Producto eliminado');
  }
}

function setupSettingsHandlers() {
  const bcvModeToggle = document.getElementById('bcv-mode-toggle');
  const manualRateInput = document.getElementById('bcv-manual-rate-input');
  const saveRateBtn = document.getElementById('save-rate-btn');
  const syncBcvBtn = document.getElementById('sync-bcv-now-btn');
  const savePhoneBtn = document.getElementById('save-phone-btn');
  const storePhoneInput = document.getElementById('store-phone-input');
  const manualRateContainer = document.getElementById('manual-rate-container');
  const savePinBtn = document.getElementById('save-pin-btn');
  const newPinInput = document.getElementById('admin-new-pin-input');

  const saveSupabaseBtn = document.getElementById('save-supabase-btn');
  const supabaseUrlInput = document.getElementById('supabase-url-input');
  const supabaseKeyInput = document.getElementById('supabase-key-input');

  if (bcvModeToggle) {
    bcvModeToggle.addEventListener('change', async (e) => {
      const settings = RepostisurStorage.getSettings();
      settings.bcvMode = e.target.checked ? 'auto' : 'manual';
      await RepostisurStorage.saveSettings(settings);

      if (manualRateContainer) {
        manualRateContainer.style.display = settings.bcvMode === 'manual' ? 'block' : 'none';
      }

      await loadBCVSettings();
      renderPriceChecker();
      renderAdminDashboard();
      renderAdminProductsTable();
      showAdminToast(`Modo de tasa: ${settings.bcvMode.toUpperCase()}`);
    });
  }

  if (saveRateBtn && manualRateInput) {
    saveRateBtn.addEventListener('click', async () => {
      const val = parseFloat(manualRateInput.value);
      if (isNaN(val) || val <= 0) {
        alert('Por favor ingresa una tasa válida en Bolívares.');
        return;
      }
      const settings = RepostisurStorage.getSettings();
      settings.manualRate = val;
      settings.currentRate = val;
      await RepostisurStorage.saveSettings(settings);

      loadBCVSettings();
      renderPriceChecker();
      renderAdminDashboard();
      renderAdminProductsTable();
      showAdminToast(`Tasa manual fijada: Bs. ${val.toFixed(2)}`);
    });
  }

  if (syncBcvBtn) {
    syncBcvBtn.addEventListener('click', async () => {
      syncBcvBtn.disabled = true;
      syncBcvBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span> Actualizando...';
      
      const settings = RepostisurStorage.getSettings();
      settings.bcvMode = 'auto';
      await RepostisurStorage.saveSettings(settings);
      
      const info = await BCVService.fetchOfficialRate();
      await loadBCVSettings();
      renderPriceChecker();
      renderAdminDashboard();
      renderAdminProductsTable();

      syncBcvBtn.disabled = false;
      syncBcvBtn.innerHTML = '<span class="material-symbols-outlined text-sm">sync</span> Sincronizar BCV Ahora';
      showAdminToast(`Tasa actualizada: Bs. ${info.rate.toFixed(2)} (${info.source})`);
    });
  }

  if (savePhoneBtn && storePhoneInput) {
    savePhoneBtn.addEventListener('click', async () => {
      const phone = storePhoneInput.value.replace(/[^0-9]/g, '');
      if (!phone || phone.length < 10) {
        alert('Ingresa un número válido con código de país (ej. 584121234567).');
        return;
      }
      const settings = RepostisurStorage.getSettings();
      settings.whatsappNumber = phone;
      await RepostisurStorage.saveSettings(settings);
      showAdminToast('Número de WhatsApp guardado en la nube.');
    });
  }

  if (savePinBtn && newPinInput) {
    savePinBtn.addEventListener('click', async () => {
      const pin = newPinInput.value.trim();
      if (!pin || pin.length < 4) {
        alert('El PIN debe tener entre 4 y 6 dígitos numéricos.');
        return;
      }
      const settings = RepostisurStorage.getSettings();
      settings.adminPin = pin;
      await RepostisurStorage.saveSettings(settings);
      newPinInput.value = '';
      showAdminToast('¡PIN de acceso actualizado exitosamente!');
    });
  }

  if (saveSupabaseBtn && supabaseUrlInput && supabaseKeyInput) {
    saveSupabaseBtn.addEventListener('click', async () => {
      const url = supabaseUrlInput.value.trim();
      const key = supabaseKeyInput.value.trim();
      if (!url || !key) {
        alert('Por favor ingresa tu Project URL y tu Anon Public Key de Supabase.');
        return;
      }
      SupabaseManager.saveConfig(url, key);
      showAdminToast('Conectando con Supabase Cloud...');
      await RepostisurStorage.syncFromCloud();
      await loadBCVSettings();
      renderPriceChecker();
      renderAdminDashboard();
      renderAdminProductsTable();
      showAdminToast('¡Conectado y sincronizado con Supabase!');
    });
  }
}

function setupAdminNavigation() {
  const sections = ['checker-view', 'dashboard-view', 'inventory-view', 'settings-view'];
  const navLinks = document.querySelectorAll('[data-view]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.dataset.view;

      navLinks.forEach(l => {
        l.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'text-secondary');
        l.classList.add('text-on-surface-variant');
      });
      link.classList.remove('text-on-surface-variant');
      link.classList.add('bg-secondary-container', 'text-on-secondary-container');

      sections.forEach(secId => {
        const sec = document.getElementById(secId);
        if (sec) {
          if (secId === `${targetView}-view`) {
            sec.classList.remove('hidden');
          } else {
            sec.classList.add('hidden');
          }
        }
      });

      if (targetView === 'checker') {
        const checkerInput = document.getElementById('checker-search-input');
        if (checkerInput) setTimeout(() => checkerInput.focus(), 100);
      }
    });
  });
}

function showAdminToast(msg) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'fixed bottom-6 right-6 bg-on-surface text-surface px-5 py-3 rounded-2xl shadow-2xl z-50 text-sm font-semibold flex items-center gap-2 transition-all duration-300 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-primary-container text-[18px]">check_circle</span> ${msg}`;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2500);
}
