// BCV Exchange Rate Service for Repostisur (Ultra-Optimized)
// Lectura ultra-rápida y 0 escrituras innecesarias en Supabase

const BCVService = {
  API_URLS: [
    'https://ve.dolarapi.com/v1/dolares/oficial',
    'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv'
  ],

  // Fuente de verdad única: lee siempre desde settings (sincronizado desde Supabase/localStorage)
  getCurrentRate() {
    const settings = RepostisurStorage.getSettings();
    if (settings.bcvMode === 'manual') {
      return Number(settings.manualRate) || 85.00;
    }
    return Number(settings.currentRate) || 85.00;
  },

  // Consulta optimizada: en la tienda de clientes solo lee; solo admin actualiza la nube
  async fetchOfficialRate(forceUpdate = false) {
    const settings = RepostisurStorage.getSettings();

    // 1. Si el modo es manual, retornar directamente la tasa configurada
    if (settings.bcvMode === 'manual') {
      return {
        rate: Number(settings.manualRate) || 85.00,
        source: 'Manual (Configurada en Admin)',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 2. Comprobar si tenemos una tasa reciente (menos de 60 minutos) para no sobrecargar llamadas
    const lastUpdate = settings.lastRateUpdate ? new Date(settings.lastRateUpdate).getTime() : 0;
    const now = Date.now();
    const isFresh = (now - lastUpdate) < (60 * 60 * 1000); // 1 hora de frescura

    if (!forceUpdate && isFresh && settings.currentRate > 0) {
      return {
        rate: Number(settings.currentRate),
        source: 'Oficial BCV (Sincronizada)',
        date: new Date(settings.lastRateUpdate).toLocaleDateString()
      };
    }

    // 3. Solo si se fuerza o expiró la frescura, consultar la API externa
    try {
      const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const rate = parseFloat(data.promedio || data.precio || data.valor);
        if (!isNaN(rate) && rate > 0) {
          const updatedSettings = { ...settings, currentRate: rate, lastRateUpdate: new Date().toISOString() };
          // Guardar localmente siempre; y en Supabase solo si es el admin quien lo ejecuta
          if (window.IS_ADMIN) {
            await RepostisurStorage.saveSettings(updatedSettings);
          } else {
            RepostisurStorage.saveSettingsLocalOnly(updatedSettings);
          }
          return {
            rate,
            source: 'Oficial BCV (En vivo)',
            date: data.fechaActualizacion || new Date().toLocaleDateString()
          };
        }
      }
    } catch (err) {
      console.warn('Fallo ve.dolarapi.com, intentando respaldo...', err);
    }

    // API de respaldo
    try {
      const backupResponse = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv', { cache: 'no-store' });
      if (backupResponse.ok) {
        const data = await backupResponse.json();
        const rate = parseFloat(data.monitors?.usd?.price || data.price);
        if (!isNaN(rate) && rate > 0) {
          const updatedSettings = { ...settings, currentRate: rate, lastRateUpdate: new Date().toISOString() };
          if (window.IS_ADMIN) {
            await RepostisurStorage.saveSettings(updatedSettings);
          } else {
            RepostisurStorage.saveSettingsLocalOnly(updatedSettings);
          }
          return {
            rate,
            source: 'Oficial BCV (Respaldo)',
            date: new Date().toLocaleDateString()
          };
        }
      }
    } catch (err) {
      console.warn('Fallo API de respaldo:', err);
    }

    // Último recurso: tasa guardada en configuración
    return {
      rate: Number(settings.currentRate) || Number(settings.manualRate) || 85.00,
      source: 'Última Tasa Registrada',
      date: settings.lastRateUpdate ? new Date(settings.lastRateUpdate).toLocaleDateString() : 'Hoy'
    };
  },

  calculateBs(usdPrice) {
    return (Number(usdPrice) || 0) * this.getCurrentRate();
  },

  formatBs(amountBs) {
    return 'Bs. ' + Number(amountBs).toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  formatUSD(amountUSD) {
    return '$' + Number(amountUSD).toFixed(2);
  },

  formatPriceDisplay(usdPrice) {
    const bs = this.calculateBs(usdPrice);
    return {
      bsFormatted: this.formatBs(bs),
      usdFormatted: this.formatUSD(usdPrice),
      bsRaw: bs,
      usdRaw: Number(usdPrice)
    };
  }
};
