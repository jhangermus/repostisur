// BCV Exchange Rate Service for Repostisur

const BCVService = {
  // Endpoints to fetch official BCV dollar rate
  API_URLS: [
    'https://ve.dolarapi.com/v1/dolares/oficial',
    'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv'
  ],

  async fetchOfficialRate() {
    const settings = RepostisurStorage.getSettings();

    // If manual mode is forced, return manual rate
    if (settings.bcvMode === 'manual') {
      return {
        rate: Number(settings.manualRate) || 85.00,
        source: 'Manual (Configurada en Admin)',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // Try primary API
    try {
      const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const rate = parseFloat(data.promedio || data.precio || data.valor);
        if (!isNaN(rate) && rate > 0) {
          settings.currentRate = rate;
          settings.lastRateUpdate = new Date().toISOString();
          RepostisurStorage.saveSettings(settings);
          return {
            rate: rate,
            source: 'Oficial BCV (En vivo)',
            date: data.fechaActualizacion || new Date().toLocaleDateString()
          };
        }
      }
    } catch (err) {
      console.warn('Fallo consulta a ve.dolarapi.com, intentando respaldo...', err);
    }

    // Try secondary API backup
    try {
      const backupResponse = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv', { cache: 'no-store' });
      if (backupResponse.ok) {
        const data = await backupResponse.json();
        const rate = parseFloat(data.monitors?.usd?.price || data.price);
        if (!isNaN(rate) && rate > 0) {
          settings.currentRate = rate;
          settings.lastRateUpdate = new Date().toISOString();
          RepostisurStorage.saveSettings(settings);
          return {
            rate: rate,
            source: 'Oficial BCV (Respaldo)',
            date: new Date().toLocaleDateString()
          };
        }
      }
    } catch (err) {
      console.warn('Fallo consulta a API de respaldo:', err);
    }

    // Fallback to last known rate stored in settings or default
    return {
      rate: Number(settings.currentRate) || Number(settings.manualRate) || 85.00,
      source: 'Caché / Última Tasa Registrada',
      date: settings.lastRateUpdate ? new Date(settings.lastRateUpdate).toLocaleDateString() : 'Hoy'
    };
  },

  getCurrentRate() {
    const settings = RepostisurStorage.getSettings();
    if (settings.bcvMode === 'manual') {
      return Number(settings.manualRate) || 85.00;
    }
    return Number(settings.currentRate) || 85.00;
  },

  calculateBs(usdPrice) {
    const rate = this.getCurrentRate();
    return (Number(usdPrice) || 0) * rate;
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
