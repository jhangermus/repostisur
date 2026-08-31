// BCV Exchange Rate Service for Repostisur
// La tasa activa siempre se lee desde Supabase > localStorage > API externa

const BCVService = {
  API_URLS: [
    'https://ve.dolarapi.com/v1/dolares/oficial',
    'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv'
  ],

  // Fuente de verdad única: lee siempre desde settings (que viene de Supabase)
  getCurrentRate() {
    const settings = RepostisurStorage.getSettings();
    if (settings.bcvMode === 'manual') {
      return Number(settings.manualRate) || 85.00;
    }
    return Number(settings.currentRate) || 85.00;
  },

  async fetchOfficialRate() {
    const settings = RepostisurStorage.getSettings();

    // Si el modo es manual, devolver tasa manual guardada en Supabase/local
    if (settings.bcvMode === 'manual') {
      return {
        rate: Number(settings.manualRate) || 85.00,
        source: 'Manual (Configurada en Admin)',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // Modo auto: consultar API externa y guardar en Supabase para sincronizar
    try {
      const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const rate = parseFloat(data.promedio || data.precio || data.valor);
        if (!isNaN(rate) && rate > 0) {
          // Guardar en settings y sincronizar a Supabase para todos los dispositivos
          const updatedSettings = { ...settings, currentRate: rate, lastRateUpdate: new Date().toISOString() };
          await RepostisurStorage.saveSettings(updatedSettings);
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
          await RepostisurStorage.saveSettings(updatedSettings);
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

    // Último recurso: tasa guardada localmente (puede venir de Supabase)
    return {
      rate: Number(settings.currentRate) || Number(settings.manualRate) || 85.00,
      source: 'Última Tasa Sincronizada',
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
