"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const pathname = usePathname()
  const { items } = useCart()
  const { data: session } = useSession()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="text-primary">Repostisur</span>
              <span className="text-secondary"> C.A. Admin</span>
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/">
              <Button variant="outline">Ver Tienda</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center" disabled>
                  <span className="text-sm font-medium">{session?.user?.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <MobileNav />
          <Link href="/" className="hidden md:flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="text-primary">Repostisur</span>
              <span className="text-secondary"> C.A.</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 ml-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-sm font-medium transition-colors hover:text-primary">
              Catálogo
            </Link>
            <Link href="/nosotros" className="text-sm font-medium transition-colors hover:text-primary">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-sm font-medium transition-colors hover:text-primary">
              Contacto
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/carrito">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session.user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Panel de Administración</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
