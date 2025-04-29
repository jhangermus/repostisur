import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Verificar si es una ruta de API de autenticación
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    // Permitir todas las solicitudes a rutas de API de autenticación
    return NextResponse.next()
  }

  // Obtener el token de la sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "tu-secreto-seguro-aqui", // Debe coincidir con el secreto en authOptions
  })

  // Verificar si la ruta comienza con /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Si no hay token (usuario no autenticado), redirigir al login
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Si el usuario no tiene rol de admin, redirigir a la página principal
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Permitir la solicitud para todas las demás rutas
  return NextResponse.next()
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*", // Añadido para asegurarnos de que el middleware procese las rutas de autenticación
  ],
}
