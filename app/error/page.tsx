"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("Ha ocurrido un error durante la autenticación.")

  useEffect(() => {
    // Obtener el error de los parámetros de búsqueda
    const error = searchParams.get("error")

    // Personalizar el mensaje según el tipo de error
    if (error) {
      switch (error) {
        case "Configuration":
          setErrorMessage("Hay un problema con la configuración del servidor.")
          break
        case "AccessDenied":
          setErrorMessage("No tienes permiso para acceder a este recurso.")
          break
        case "Verification":
          setErrorMessage("El enlace de verificación ha expirado o ya ha sido utilizado.")
          break
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
        case "EmailCreateAccount":
        case "Callback":
          setErrorMessage("Hubo un problema con el proveedor de autenticación.")
          break
        case "OAuthAccountNotLinked":
          setErrorMessage("Esta cuenta ya está asociada con otro método de inicio de sesión.")
          break
        case "EmailSignin":
          setErrorMessage("El enlace de inicio de sesión por correo electrónico no es válido o ha expirado.")
          break
        case "CredentialsSignin":
          setErrorMessage("Las credenciales proporcionadas no son válidas.")
          break
        case "SessionRequired":
          setErrorMessage("Debes iniciar sesión para acceder a este recurso.")
          break
        default:
          setErrorMessage("Ha ocurrido un error desconocido durante la autenticación.")
      }
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Error de Autenticación</CardTitle>
            <CardDescription>Se ha producido un error durante el proceso de autenticación</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Intentar de nuevo</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
