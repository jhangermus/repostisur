import { NextResponse } from "next/server"

// Este manejador intercepta las solicitudes a /api/auth/error y las redirige a /error
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const errorParam = searchParams.get("error") || ""

  // Redirigir a la página de error con el parámetro de error
  return NextResponse.redirect(new URL(`/error?error=${errorParam}`, request.url))
}
