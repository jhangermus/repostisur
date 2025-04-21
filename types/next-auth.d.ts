import "next-auth"

// Extendemos los tipos de NextAuth para incluir el rol en el usuario
declare module "next-auth" {
  interface User {
    role?: string
  }

  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}
