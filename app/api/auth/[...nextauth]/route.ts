import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

// Esta es la configuración de NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // El nombre que se mostrará en la página de inicio de sesión
      name: "Credenciales",

      // Configuración de los campos del formulario de inicio de sesión
      credentials: {
        email: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Contraseña", type: "password" },
      },

      // Función que verifica las credenciales
      async authorize(credentials) {
        // En un entorno real, aquí verificarías contra una base de datos
        // Por ahora, usamos credenciales hardcodeadas para demostración
        if (credentials?.email === "admin@repostisur.com" && credentials?.password === "admin123") {
          // Si las credenciales son correctas, devuelve un objeto de usuario
          return {
            id: "1",
            name: "Administrador",
            email: "admin@repostisur.com",
            role: "admin",
          }
        }

        // Si las credenciales son incorrectas, devuelve null
        return null
      },
    }),
  ],

  // Configuración de páginas personalizadas
  pages: {
    signIn: "/login",
    error: "/error", // Cambiado a /error en la raíz
  },

  // Configuración de la sesión
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  // Callbacks para personalizar tokens y sesiones
  callbacks: {
    // Personaliza el token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },

    // Personaliza el objeto de sesión
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },

  // Secreto para firmar cookies (en producción, usa una variable de entorno)
  secret: process.env.NEXTAUTH_SECRET || "tu-secreto-seguro-aqui",

  // Configuración de debug para entornos de desarrollo
  debug: process.env.NODE_ENV === "development",
}

// Manejador de la API de NextAuth
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
