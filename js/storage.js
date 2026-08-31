// Repostisur Unified Data Layer (Supabase Cloud + Base64 Fallback + Realtime Sync)

const STORAGE_KEYS = {
  PRODUCTS: 'repostisur_products',
  SETTINGS: 'repostisur_settings',
  CART: 'repostisur_cart',
  AUTH_SESSION: 'repostisur_admin_session'
};

const DEFAULT_SETTINGS = {
  storeName: 'Repostisur',
  whatsappNumber: '584121234567',
  address: 'Av. Principal, Edificio Repostisur, Local 1',
  adminPin: '1234',
  bcvMode: 'auto',
  manualRate: 85.00,
  currentRate: 85.00,
  lastRateUpdate: null,
  currencySymbol: 'Bs.'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'CC-001',
    name: 'Cacao en Polvo Alcalino 100%',
    category: 'cacao',
    categoryName: 'Cacao',
    priceUSD: 5.00,
    unit: '1 kg',
    stock: 250,
    status: 'active',
    featured: true,
    badge: 'Oferta',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRXofrIKuT_GBcArBE_5jwD6uL758ZXATbWB9v739OaU6UZnGiiLOrXfD0qBp-wm0s4IKVnWnbMefaOQO1OurTI_0lyP5uiR3iqJJKr-9N_sG075TmnKIX4rnavncGjzpd_9z_h6DvfLjb8-0bEQuFOsKTKsoosxe7qF9OPUrCwbVpcZNCLCd5mjrJDY0wtVsSAf6OyfKQGYCDZPNdK3zP1S_1Dbb_ewCQfnl7CkPXUA25n-Men9TM',
    description: 'Cacao en polvo de grado profesional, alcalinizado para un sabor intenso y color profundo en tortas y coberturas.'
  },
  {
    id: 'DS-042',
    name: 'Vasos Desechables Domo 7oz (Paq. 50)',
    category: 'desechables',
    categoryName: 'Desechables',
    priceUSD: 2.00,
    unit: '50 und',
    stock: 50,
    status: 'active',
    featured: true,
    badge: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_lCQrSWyjfAy0COZy7hDM_C_t82RZ-iQKy2WQZO3U_BfYNGXwbAM6XXJjY0wPlJtctCP880n87Yb_VUqBtCyEFOr-NNlvv7HjBTRi_LhDhgj07cPYksYy0de2WFXXpCRp2ShutujWlKAvUv_mUQqowXwCUh44vMDP312Q30WY3h062y0N_y-5jyyQeq-tDLInKUr_H4VCA0J8X-NmFKbbF0gOYYU1rMsAa9HDF4yDjdV4CAV3-M-Y',
    description: 'Vasos plásticos transparentes ultrarresistentes con tapa domo sin orificio, perfectos para postres fríos y gelatinas.'
  },
  {
    id: 'PD-015',
    name: 'Mezcla para Pudín de Vainilla',
    category: 'pudines',
    categoryName: 'Pudines',
    priceUSD: 3.00,
    unit: '500g',
    stock: 15,
    status: 'low_stock',
    featured: true,
    badge: 'Nuevo',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0BgAPNzfaAFWL1ktXtnZdfSOIqCFA_cDJUxDmgVUxWVRP0tc2cd4YfsVSf42ik8kGm-I9MRc2xKL0MbrzYjHpf43XX0160cPVpArFQYKXitK43cjIYmhpYPAI_nW83mYtFHKjOf3oH_Of0aL4I9f1mrC19dymkjs0gcNwoKvo-OmlOE2-IO6tbTGaxKYkNhd9JBV4WYIGfOQ5zYE34H--BQ7xtYiXFpeEqmLselBlRcyZHHWeLiKz',
    description: 'Premezcla instantánea para pudín y crema pastelera sabor vainilla, consistencia suave y cremosa.'
  },
  {
    id: 'CC-088',
    name: 'Gotas de Chocolate Oscuro para Hornear',
    category: 'cacao',
    categoryName: 'Cacao',
    priceUSD: 4.50,
    unit: '500g',
    stock: 120,
    status: 'active',
    featured: false,
    badge: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZnMqxYSghrsVFF50dE7FUiEJd3v1NmZeoB8gy9ACvrK13ymKIHY1q1qq23etYNxS8HxgTkweNxuYEINh0t0Lec7BD88z1jumaEuy0ZoJEZ_c4bSP8ET7uLu9YTdMjdHZ54_HSh6cpm0YtJOpIoEDuRWnc0zID_NH_aLfDByeYJa1qeKONhEZ7LFaQwuKPAfS6lcnr3tO9iqhNVKdTBnKVwvprhaicT6QHY8TtvqN3cMkTxe8toIQP',
    description: 'Chispas de chocolate semidulce resistentes a altas temperaturas, ideales para galletas, muffins y panes.'
  },
  {
    id: 'CC-095',
    name: 'Manteca de Cacao Pura Desodorizada',
    category: 'cacao',
    categoryName: 'Cacao',
    priceUSD: 8.50,
    unit: '1 kg',
    stock: 80,
    status: 'active',
    featured: false,
    badge: 'Premium',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUt_eCKmDcDNgMdSoEkFrcqJC2aC0wv8eWSUrJhYxGEifleHrvlLMpeFqMIGLc1eAck9-SxnE6BUqc3QsTGrIdGd4FJ68vei-ZAVka31HXB20mLypwBmTyx3b1-z5G3xSuKhcNI942Sgapbx9hlsnGX0BDSZyOTN6XEV_lEdCa-OPtk2LN1QuY4vSd8lD42lPFhJG0Nyvt9sJXUDJCBgdGvTkwrnXSEMRTc2cKyehfErhempeFQ0vd',
    description: 'Grasa natural de cacao pura 100%, esencial para temperado de chocolate, bombones y brillo de coberturas.'
  },
  {
    id: 'DS-102',
    name: 'Bandejas de Aluminio con Tapa 500ml',
    category: 'desechables',
    categoryName: 'Desechables',
    priceUSD: 3.20,
    unit: 'Paq. 25u',
    stock: 0,
    status: 'out_of_stock',
    featured: false,
    badge: 'Agotado',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZxaDPXL0qc5Qfuksna9m7jpEbOjKKJ3k9UgKOHIeT9QtvHCK__2kkunmucLU29j83sZ6QGB2EVZ3ULLmbYhMTo8OAy8-F5kUrJDo230V92LJRJwKpB_jbhkcmh50pLT-EePlLuNN9d5cIVz3cyum2Zs2sJgO8H4ZmLekT8XzyALnomh2ov9t0JnlAf7yPrrlHfJk3VJ8t3ByB1mvqHpqgcN2E-0uk51D4h43s2x8-kKA5VMDMqUgS',
    description: 'Moldes descartables de aluminio aptos para horno y congelador, ideales para marquesas, quesillos y mini pasteles.'
  }
];

const RepostisurStorage = {
  async syncFromCloud() {
    const client = SupabaseManager.getClient();
    if (!client) return this.getProducts();

    try {
      // 1. Sync Products from Supabase Cloud
      const { data: cloudProducts, error: prodErr } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodErr && cloudProducts) {
        if (cloudProducts.length > 0) {
          const mappedProducts = cloudProducts.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            categoryName: p.category_name || p.category,
            priceUSD: Number(p.price_usd),
            unit: p.unit,
            stock: p.stock,
            status: p.status,
            image: p.image_url || '',
            badge: p.badge || '',
            featured: !!p.featured,
            description: p.description || ''
          }));
          this.saveProducts(mappedProducts);
          return mappedProducts;
        } else {
          // If cloud has 0 products yet, seed default products to cloud
          for (const item of DEFAULT_PRODUCTS) {
            await client.from('products').upsert({
              id: item.id,
              name: item.name,
              category: item.category,
              category_name: item.categoryName || item.category,
              price_usd: item.priceUSD,
              unit: item.unit,
              stock: item.stock,
              status: item.status,
              image_url: item.image,
              badge: item.badge,
              featured: item.featured,
              description: item.description
            }, { onConflict: 'id' });
          }
        }
      }

      // 2. Sync Settings from Supabase Cloud
      const { data: cloudSettings, error: setErr } = await client
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!setErr && cloudSettings) {
        const mappedSettings = {
          storeName: cloudSettings.store_name || 'Repostisur',
          whatsappNumber: cloudSettings.whatsapp_number || '584121234567',
          address: cloudSettings.address || '',
          adminPin: cloudSettings.admin_pin || '1234',
          bcvMode: cloudSettings.bcv_mode || 'auto',
          manualRate: Number(cloudSettings.manual_rate) || 85.00,
          currentRate: Number(cloudSettings.current_rate) || 85.00,
          lastRateUpdate: cloudSettings.last_rate_update
        };
        this.saveSettings(mappedSettings);
      }

      this.initRealtimeSubscriptions(client);
    } catch (err) {
      console.warn('⚠️ Error al sincronizar con Supabase Cloud:', err);
    }
    return this.getProducts();
  },

  realtimeActive: false,
  pollingInterval: null,

  initRealtimeSubscriptions(client) {
    if (this.realtimeActive || !client) return;
    this.realtimeActive = true;

    // Realtime: escucha cambios en products Y store_settings
    client.channel('repostisur-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        this.syncFromCloud().then(() => window.dispatchEvent(new CustomEvent('repostisur_data_updated')));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, () => {
        console.log('🔄 Cambio en store_settings detectado vía Realtime');
        this.syncSettingsOnly(client).then(() => window.dispatchEvent(new CustomEvent('repostisur_settings_updated')));
      })
      .subscribe((status) => {
        console.log('📡 Realtime status:', status);
      });

    // Polling de respaldo cada 30 segundos (garantiza sincronización de tasa BCV, modo, PIN, etc.)
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    this.pollingInterval = setInterval(() => {
      this.syncSettingsOnly(client).then(() => {
        window.dispatchEvent(new CustomEvent('repostisur_settings_updated'));
      });
    }, 30000);
  },

  async syncSettingsOnly(client) {
    if (!client) return;
    try {
      const { data, error } = await client
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        const mappedSettings = {
          storeName: data.store_name || 'Repostisur',
          whatsappNumber: data.whatsapp_number || '584121234567',
          address: data.address || '',
          adminPin: data.admin_pin || '1234',
          bcvMode: data.bcv_mode || 'auto',
          manualRate: Number(data.manual_rate) || 85.00,
          currentRate: Number(data.current_rate) || 85.00,
          lastRateUpdate: data.last_rate_update
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mappedSettings));
        return mappedSettings;
      }
    } catch (err) {
      console.warn('Error al sincronizar settings:', err);
    }
  },

  getProducts() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      this.saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  },

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  },

  async saveProduct(product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...products[index], ...product };
    } else {
      if (!product.id) {
        product.id = 'PRD-' + Date.now().toString().slice(-4);
      }
      products.unshift(product);
    }
    this.saveProducts(products);

    // Save directly to Supabase Cloud
    const client = SupabaseManager.getClient();
    if (client) {
      try {
        const cloudRecord = {
          id: product.id,
          name: product.name,
          category: product.category,
          category_name: product.categoryName || product.category,
          price_usd: product.priceUSD,
          unit: product.unit,
          stock: product.stock,
          status: product.status,
          image_url: product.image || null,
          badge: product.badge || null,
          featured: !!product.featured,
          description: product.description || null
        };

        const { error } = await client
          .from('products')
          .upsert(cloudRecord, { onConflict: 'id' });

        if (error) {
          console.error('❌ Error al guardar en Supabase:', error);
        } else {
          console.log('✅ Producto guardado y sincronizado en Supabase Cloud:', product.id);
        }
      } catch (err) {
        console.warn('Error en conexión con Supabase:', err);
      }
    }

    return product;
  },

  async deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);

    const client = SupabaseManager.getClient();
    if (client) {
      try {
        await client.from('products').delete().eq('id', id);
        console.log('✅ Producto eliminado de Supabase Cloud:', id);
      } catch (err) {
        console.warn('Error eliminando en Supabase:', err);
      }
    }
  },

  getSettings() {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

    const client = SupabaseManager.getClient();
    if (client) {
      try {
        await client.from('store_settings').upsert({
          id: 1,
          store_name: settings.storeName,
          whatsapp_number: settings.whatsappNumber,
          address: settings.address,
          admin_pin: settings.adminPin,
          bcv_mode: settings.bcvMode,
          manual_rate: settings.manualRate,
          current_rate: settings.currentRate,
          last_rate_update: settings.lastRateUpdate || new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (err) {
        console.warn('Error actualizando ajustes en Supabase:', err);
      }
    }
  },

  // Image Upload with Automatic Resize & Fallback
  async uploadImage(file) {
    const base64Promise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    const localBase64 = await base64Promise;

    const client = SupabaseManager.getClient();
    if (client) {
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const { error } = await client.storage
          .from('repostisur-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (!error) {
          const { data: urlData } = client.storage
            .from('repostisur-images')
            .getPublicUrl(fileName);
          if (urlData?.publicUrl) {
            return urlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Storage bucket no disponible, usando imagen embebida:', err);
      }
    }

    return localBase64;
  },

  getCart() {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  addToCart(productId, quantity = 1) {
    const cart = this.getCart();
    const product = this.getProductById(productId);
    if (!product) return cart;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        priceUSD: product.priceUSD,
        unit: product.unit,
        image: product.image,
        quantity: quantity
      });
    }
    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(item => item.id === productId);
      if (item) item.quantity = quantity;
    }
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  isAdminAuthenticated() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
  },

  setAdminAuthenticated(auth) {
    if (auth) {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  },

  verifyPin(pin) {
    const settings = this.getSettings();
    return (pin && (pin.toString().trim() === (settings.adminPin || '1234').toString().trim()));
  }
};
