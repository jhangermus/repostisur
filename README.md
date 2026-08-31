# 🧁 Repostisur - E-Commerce & Panel Administrativo PWA

Plataforma de comercio electrónico y consultor de precios en punto de venta (POS) para insumos de repostería con cálculo dinámico a tasa oficial del BCV y pedidos directos a WhatsApp.

---

## 🚀 Pasos para Despliegue en Línea (Vercel + Supabase)

### Paso 1: Configurar la Base de Datos en Supabase (2 minutos)
1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Ve a la sección **SQL Editor** en el panel izquierdo de Supabase.
3. Copia el contenido del archivo [`schema.sql`](./schema.sql) y haz clic en **"Run"** para crear las tablas y datos iniciales.
4. *(Opcional para fotos)* Ve a **Storage** en Supabase, crea un bucket llamado `repostisur-images` y márcalo como **"Public Bucket"**.
5. En **Project Settings > API**, copia tu **Project URL** y tu **anon public key**.

### Paso 2: Desplegar en Vercel (1 minuto)
1. Sube esta carpeta a tu repositorio de GitHub o arrástrala directamente con la CLI de Vercel (`vercel`).
2. En [vercel.com](https://vercel.com), importa el repositorio y haz clic en **"Deploy"**.
3. ¡Listo! Vercel te dará una URL segura con HTTPS (ej. `https://repostisur.vercel.app`).

### Paso 3: Conectar Supabase desde el Panel Administrativo
1. Abre tu aplicación desplegada: `https://tu-proyecto.vercel.app/admin.html`.
2. Ingresa el PIN por defecto: `1234`.
3. Ve a la pestaña **Ajustes**, pega tu **Project URL** y **Anon Key**, y pulsa **"Guardar y Conectar Supabase"**.
4. A partir de ese momento, todos los productos, fotos, precios e inventario se sincronizarán en la nube y en tiempo real.

---

## 📱 URLs de la Plataforma
- **Tienda para Clientes:** `https://tu-dominio.vercel.app/index.html` (o la raíz `/`)
- **Panel Admin y Consultor POS:** `https://tu-dominio.vercel.app/admin.html` (Protegido por PIN)
