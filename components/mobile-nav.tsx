"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <span className="font-bold text-xl">
            <span className="text-primary">Repostisur</span>
            <span className="text-secondary"> C.A.</span>
          </span>
        </Link>
        <div className="flex flex-col space-y-3 mt-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            onClick={() => setOpen(false)}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Catálogo
          </Link>
          <Link
            href="/nosotros"
            onClick={() => setOpen(false)}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            onClick={() => setOpen(false)}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contacto
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
