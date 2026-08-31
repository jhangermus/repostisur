// Repostisur Supabase Client Configuration & Connection Manager

const SUPABASE_STORAGE_KEYS = {
  URL: 'repostisur_supabase_url',
  KEY: 'repostisur_supabase_key'
};

// Credenciales oficiales de Supabase para Repostisur
const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://ofkrjjgsftuyrzjwzedv.supabase.co',
  anonKey: 'sb_publishable_ZNE6necAFYXfvB5JLdbrng_y6A6tSTv'
};

const SupabaseManager = {
  client: null,

  getConfig() {
    const savedUrl = localStorage.getItem(SUPABASE_STORAGE_KEYS.URL);
    const savedKey = localStorage.getItem(SUPABASE_STORAGE_KEYS.KEY);
    return {
      url: savedUrl || DEFAULT_SUPABASE_CONFIG.url,
      anonKey: savedKey || DEFAULT_SUPABASE_CONFIG.anonKey
    };
  },

  saveConfig(url, anonKey) {
    if (url) {
      // Clean url if /rest/v1 was appended
      url = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
      localStorage.setItem(SUPABASE_STORAGE_KEYS.URL, url);
    }
    if (anonKey) {
      localStorage.setItem(SUPABASE_STORAGE_KEYS.KEY, anonKey.trim());
    }
    this.client = null;
    return this.getClient();
  },

  isConfigured() {
    const config = this.getConfig();
    return !!(config.url && config.anonKey && config.url.startsWith('http') && window.supabase);
  },

  getClient() {
    if (this.client) return this.client;
    const config = this.getConfig();
    const cleanUrl = (config.url || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    
    if (cleanUrl && config.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(cleanUrl, config.anonKey);
        console.log('✅ Conectado exitosamente a Supabase Repostisur:', cleanUrl);
        return this.client;
      } catch (err) {
        console.warn('⚠️ Error al inicializar Supabase client:', err);
        return null;
      }
    }
    return null;
  }
};
