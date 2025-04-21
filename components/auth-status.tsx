"use client"

import { useSession } from "next-auth/react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Cargando...</div>
  }

  if (status === "authenticated") {
    return (
      <div>
        <p>Autenticado como {session.user?.name}</p>
        <p>Rol: {session.user?.role}</p>
      </div>
    )
  }

  return <div>No autenticado</div>
}
