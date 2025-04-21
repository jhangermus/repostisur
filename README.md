# Repostisur - Tienda Online de Suministros para Repostería

Esta es una tienda online desarrollada con Next.js para vender productos de repostería, con un panel de administración para gestionar los productos y la posibilidad de recibir pedidos por WhatsApp.

## Tecnologías

- Next.js 15
- React 19
- Tailwind CSS
- NextAuth.js para autenticación
- Vercel KV para almacenamiento de datos

## Desarrollo Local

1. Clonar el repositorio:

```bash
git clone [url-del-repositorio]
cd bakery-supplies-store
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crea un archivo `.env.local` con el siguiente contenido:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-seguro-aqui

# Estas variables se obtendrán cuando conectes Vercel KV a tu proyecto
# Puedes dejarlas como ejemplo para desarrollo local
KV_URL=example_value
KV_REST_API_URL=example_value
KV_REST_API_TOKEN=example_value
KV_REST_API_READ_ONLY_TOKEN=example_value
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

5. Acceder a http://localhost:3000

## Despliegue en Vercel

### Paso 1: Configurar el Proyecto en Vercel

1. Crear una cuenta en [Vercel](https://vercel.com) si aún no tienes una.
2. Haz clic en "Add New..." y selecciona "Project".
3. Importa tu repositorio Git.
4. En la configuración del proyecto:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install

### Paso 2: Configurar Vercel KV

1. En la página de tu proyecto en Vercel, ve a "Storage".
2. Haz clic en "Add Storage".
3. Selecciona "KV Database".
4. Elige un nombre para tu base de datos (ej: "repostisur-kv").
5. Selecciona una región cercana a tu audiencia principal.
6. Haz clic en "Create".

Una vez creada, Vercel configurará automáticamente las variables de entorno KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN y KV_REST_API_READ_ONLY_TOKEN.

### Paso 3: Configurar Variables de Entorno Adicionales

En la sección "Settings" > "Environment Variables" de tu proyecto en Vercel, añade:

- `NEXTAUTH_SECRET`: repostisur-secret-key-2024-vercel-deploy
- `NEXTAUTH_URL`: (La URL de tu proyecto, ej: https://repostisur.vercel.app)

### Paso 4: Desplegar

1. Asegúrate de que todos los cambios estén guardados y pusheados a tu repositorio.
2. Haz clic en "Deploy" en la página de tu proyecto en Vercel.

## Acceso al Panel de Administración

Una vez desplegado, accede al panel de administración en `/login` con:

- Email: admin@repostisur.com
- Contraseña: admin123

## Funcionalidades Principales

- Catálogo de productos con filtros por categoría
- Carrito de compras
- Proceso de pedido por WhatsApp
- Panel de administración para gestionar productos

## Configuración del Número de WhatsApp

El número de WhatsApp de la tienda está configurado en:

- `components/whatsapp-button.tsx`
- `hooks/use-cart.tsx`

Si necesitas cambiar el número, actualiza ambos archivos con el formato internacional (ej: 584246687465). 