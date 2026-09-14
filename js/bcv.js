// BCV Exchange Rate Service for Repostisur
// Fuente de verdad: Supabase (store_settings.current_rate)
// La API externa solo la consulta el admin para actualizar en Supabase

const BCVService = {
  // Endpoints externos (solo usados desde el admin para actualizar la nube)
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

  // Lee siempre desde localStorage (que se sincroniza desde Supabase al cargar)
  getCurrentRate() {
    const settings = RepostisurStorage.getSettings();
    if (settings.bcvMode === 'manual') {
      return Number(settings.manualRate) || 842.21;
    }
    return Number(settings.currentRate) || 842.21;
  },

  // fetchOfficialRate:
  // - Clientes (IS_ADMIN=false): lee de Supabase directamente (fuente de verdad)
  // - Admin (IS_ADMIN=true, forceUpdate=true): consulta APIs externas y actualiza Supabase
  async fetchOfficialRate(forceUpdate = false) {
    const settings = RepostisurStorage.getSettings();

    // Modo manual: devolver tasa fijada por el admin
    if (settings.bcvMode === 'manual') {
      return {
        rate: Number(settings.manualRate) || 842.21,
        source: 'Manual (Configurada en Admin)',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // Si es admin forzando actualización: consultar API externa y guardar en Supabase
    if (forceUpdate && window.IS_ADMIN) {
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
              // Guardar en Supabase para que todos los dispositivos lean el valor correcto
              await RepostisurStorage.saveSettings(updatedSettings);
              console.log(`✅ Tasa BCV actualizada desde ${endpoint.url}: Bs. ${rate.toFixed(2)}`);
              return {
                rate: Number(rate.toFixed(2)),
                source: 'Oficial BCV (En vivo)',
                date: new Date().toLocaleDateString()
              };
            }
          }
        } catch (err) {
          console.warn(`Error consultando ${endpoint.url}:`, err);
        }
      }
    }

    // Para clientes Y para admin sin forceUpdate:
    // Leer directamente desde Supabase (fuente de verdad) sin pasar por caché
    const client = SupabaseManager.getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('store_settings')
          .select('current_rate, bcv_mode, manual_rate, last_rate_update')
          .eq('id', 1)
          .single();

        if (!error && data) {
          const rate = data.bcv_mode === 'manual'
            ? Number(data.manual_rate)
            : Number(data.current_rate);

          // Actualizar el localStorage con la tasa real de Supabase
          const updatedSettings = {
            ...settings,
            currentRate: rate,
            bcvMode: data.bcv_mode,
            manualRate: Number(data.manual_rate),
            lastRateUpdate: data.last_rate_update
          };
          RepostisurStorage.saveSettingsLocalOnly(updatedSettings);

          return {
            rate,
            source: 'Oficial BCV (Sincronizada)',
            date: data.last_rate_update
              ? new Date(data.last_rate_update).toLocaleDateString()
              : new Date().toLocaleDateString()
          };
        }
      } catch (err) {
        console.warn('Error leyendo tasa desde Supabase:', err);
      }
    }

    // Último recurso: localStorage local
    return {
      rate: Number(settings.currentRate) || 842.21,
      source: 'Última Tasa Registrada',
      date: settings.lastRateUpdate
        ? new Date(settings.lastRateUpdate).toLocaleDateString()
        : 'Hoy'
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
