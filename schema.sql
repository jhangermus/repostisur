-- =========================================================
-- ESQUEMA DE BASE DE DATOS PARA REPOSTISUR (SUPABASE)
-- =========================================================
-- Copia y pega este script en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Tabla de Insumos / Productos
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_name TEXT NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  unit TEXT NOT NULL DEFAULT '1 unidad',
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'active',
  image_url TEXT,
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Configuración de la Tienda y Tasa BCV
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'Repostisur',
  whatsapp_number TEXT DEFAULT '584121234567',
  address TEXT DEFAULT 'Av. Principal, Edificio Repostisur, Local 1',
  admin_pin TEXT DEFAULT '1234',
  bcv_mode TEXT DEFAULT 'auto',
  manual_rate NUMERIC(10, 2) DEFAULT 85.00,
  current_rate NUMERIC(10, 2) DEFAULT 85.00,
  last_rate_update TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insertar Datos Iniciales de Ejemplo
INSERT INTO public.store_settings (id, store_name, whatsapp_number, address, admin_pin, bcv_mode, manual_rate, current_rate)
VALUES (1, 'Repostisur', '584121234567', 'Av. Principal, Edificio Repostisur, Local 1', '1234', 'auto', 85.00, 85.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, category_name, price_usd, unit, stock, status, featured, badge, image_url, description)
VALUES 
  ('CC-001', 'Cacao en Polvo Alcalino 100%', 'cacao', 'Cacao', 5.00, '1 kg', 250, 'active', true, 'Oferta', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRXofrIKuT_GBcArBE_5jwD6uL758ZXATbWB9v739OaU6UZnGiiLOrXfD0qBp-wm0s4IKVnWnbMefaOQO1OurTI_0lyP5uiR3iqJJKr-9N_sG075TmnKIX4rnavncGjzpd_9z_h6DvfLjb8-0bEQuFOsKTKsoosxe7qF9OPUrCwbVpcZNCLCd5mjrJDY0wtVsSAf6OyfKQGYCDZPNdK3zP1S_1Dbb_ewCQfnl7CkPXUA25n-Men9TM', 'Cacao en polvo de grado profesional alcalinizado.'),
  ('DS-042', 'Vasos Desechables Domo 7oz (Paq. 50)', 'desechables', 'Desechables', 2.00, '50 und', 50, 'active', true, '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_lCQrSWyjfAy0COZy7hDM_C_t82RZ-iQKy2WQZO3U_BfYNGXwbAM6XXJjY0wPlJtctCP880n87Yb_VUqBtCyEFOr-NNlvv7HjBTRi_LhDhgj07cPYksYy0de2WFXXpCRp2ShutujWlKAvUv_mUQqowXwCUh44vMDP312Q30WY3h062y0N_y-5jyyQeq-tDLInKUr_H4VCA0J8X-NmFKbbF0gOYYU1rMsAa9HDF4yDjdV4CAV3-M-Y', 'Vasos plásticos ultrarresistentes con tapa domo.'),
  ('PD-015', 'Mezcla para Pudín de Vainilla', 'pudines', 'Pudines', 3.00, '500g', 15, 'low_stock', true, 'Nuevo', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0BgAPNzfaAFWL1ktXtnZdfSOIqCFA_cDJUxDmgVUxWVRP0tc2cd4YfsVSf42ik8kGm-I9MRc2xKL0MbrzYjHpf43XX0160cPVpArFQYKXitK43cjIYmhpYPAI_nW83mYtFHKjOf3oH_Of0aL4I9f1mrC19dymkjs0gcNwoKvo-OmlOE2-IO6tbTGaxKYkNhd9JBV4WYIGfOQ5zYE34H--BQ7xtYiXFpeEqmLselBlRcyZHHWeLiKz', 'Premezcla instantánea para pudín suave y cremoso.'),
  ('CC-088', 'Gotas de Chocolate Oscuro para Hornear', 'cacao', 'Cacao', 4.50, '500g', 120, 'active', false, '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZnMqxYSghrsVFF50dE7FUiEJd3v1NmZeoB8gy9ACvrK13ymKIHY1q1qq23etYNxS8HxgTkweNxuYEINh0t0Lec7BD88z1jumaEuy0ZoJEZ_c4bSP8ET7uLu9YTdMjdHZ54_HSh6cpm0YtJOpIoEDuRWnc0zID_NH_aLfDByeYJa1qeKONhEZ7LFaQwuKPAfS6lcnr3tO9iqhNVKdTBnKVwvprhaicT6QHY8TtvqN3cMkTxe8toIQP', 'Chispas resistentes al horneado para galletas.'),
  ('CC-095', 'Manteca de Cacao Pura Desodorizada', 'cacao', 'Cacao', 8.50, '1 kg', 80, 'active', false, 'Premium', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUt_eCKmDcDNgMdSoEkFrcqJC2aC0wv8eWSUrJhYxGEifleHrvlLMpeFqMIGLc1eAck9-SxnE6BUqc3QsTGrIdGd4FJ68vei-ZAVka31HXB20mLypwBmTyx3b1-z5G3xSuKhcNI942Sgapbx9hlsnGX0BDSZyOTN6XEV_lEdCa-OPtk2LN1QuY4vSd8lD42lPFhJG0Nyvt9sJXUDJCBgdGvTkwrnXSEMRTc2cKyehfErhempeFQ0vd', 'Grasa natural de cacao pura 100% para repostería.'),
  ('DS-102', 'Bandejas de Aluminio con Tapa 500ml', 'desechables', 'Desechables', 3.20, 'Paq. 25u', 0, 'out_of_stock', false, 'Agotado', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZxaDPXL0qc5Qfuksna9m7jpEbOjKKJ3k9UgKOHIeT9QtvHCK__2kkunmucLU29j83sZ6QGB2EVZ3ULLmbYhMTo8OAy8-F5kUrJDo230V92LJRJwKpB_jbhkcmh50pLT-EePlLuNN9d5cIVz3cyum2Zs2sJgO8H4ZmLekT8XzyALnomh2ov9t0JnlAf7yPrrlHfJk3VJ8t3ByB1mvqHpqgcN2E-0uk51D4h43s2x8-kKA5VMDMqUgS', 'Moldes descartables con tapa.')
ON CONFLICT (id) DO NOTHING;

-- 4. Políticas de Seguridad (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Permitir lectura y modificación pública mediante la anon key
CREATE POLICY "Acceso total a productos" ON public.products FOR ALL USING (true);
CREATE POLICY "Acceso total a configuracion" ON public.store_settings FOR ALL USING (true);

-- 5. Habilitar Realtime en las tablas
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
