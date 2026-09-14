// BCV Exchange Rate Service for Repostisur (Ultra-Accurate & Multi-API)
// Consulta la tasa oficial BCV del día en vivo con respaldo múltiple

const BCVService = {
  // Endpoints oficiales con soporte CORS y actualización diaria en vivo
  API_ENDPOINTS: [
    {
      url: 'https://open.er-api.com/v6/latest/USD',
      parser: (data) => data?.rates?.VES
    },
    {
      url: 'https://api.exchangerate-api.com/v4/latest/USD',
      parser: (data) => data?.rates?.VES
    },
    {
      url: 'https://ve.dolarapi.com/v1/dolares/oficial',
      parser: (data) => parseFloat(data?.promedio || data?.precio || data?.valor)
    }
  ],

  // Fuente de verdad única: lee siempre desde settings (sincronizado desde Supabase/localStorage)
  getCurrentRate() {
    const settings = RepostisurStorage.getSettings();
    if (settings.bcvMode === 'manual') {
      return Number(settings.manualRate) || 842.20;
    }
    return Number(settings.currentRate) || 842.20;
  },

  async fetchOfficialRate(forceUpdate = false) {
    const settings = RepostisurStorage.getSettings();

    // 1. Si el modo es manual, retornar directamente la tasa fijada por el admin
    if (settings.bcvMode === 'manual') {
      return {
        rate: Number(settings.manualRate) || 842.20,
        source: 'Manual (Configurada en Admin)',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 2. Si no es forzada y la tasa guardada tiene menos de 30 min, usar la actual
    const lastUpdate = settings.lastRateUpdate ? new Date(settings.lastRateUpdate).getTime() : 0;
    const isFresh = (Date.now() - lastUpdate) < (30 * 60 * 1000);

    if (!forceUpdate && isFresh && settings.currentRate > 0) {
      return {
        rate: Number(settings.currentRate),
        source: 'Oficial BCV (Sincronizada)',
        date: new Date(settings.lastRateUpdate).toLocaleDateString()
      };
    }

    // 3. Consultar las APIs en orden de prioridad hasta obtener la tasa del día
    for (const endpoint of this.API_ENDPOINTS) {
      try {
        const response = await fetch(endpoint.url, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          const rate = endpoint.parser(data);
          if (!isNaN(rate) && rate > 0) {
            const updatedSettings = {
              ...settings,
              currentRate: Number(rate.toFixed(2)),
              lastRateUpdate: new Date().toISOString()
            };

            // Guardar en Supabase para todos los dispositivos
            if (window.IS_ADMIN) {
              await RepostisurStorage.saveSettings(updatedSettings);
            } else {
              RepostisurStorage.saveSettingsLocalOnly(updatedSettings);
            }

            console.log(`✅ Tasa BCV actualizada desde ${endpoint.url}: Bs. ${rate.toFixed(2)}`);
            return {
              rate: Number(rate.toFixed(2)),
              source: 'Oficial BCV (En vivo)',
              date: new Date().toLocaleDateString()
            };
          }
        }
      } catch (err) {
        console.warn(`Error consultando endpoint ${endpoint.url}:`, err);
      }
    }

    // Respaldo final si no hay internet
    return {
      rate: Number(settings.currentRate) || Number(settings.manualRate) || 842.20,
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
