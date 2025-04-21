import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">
                <span className="text-primary">Repostisur</span>
                <span className="text-secondary"> C.A.</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Tienda especializada en insumos de repostería, materiales al mayor y materia prima.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-primary">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-primary">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogo/moldes" className="hover:text-primary">
                  Moldes
                </Link>
              </li>
              <li>
                <Link href="/catalogo/colorantes" className="hover:text-primary">
                  Colorantes
                </Link>
              </li>
              <li>
                <Link href="/catalogo/utensilios" className="hover:text-primary">
                  Utensilios
                </Link>
              </li>
              <li>
                <Link href="/catalogo/ingredientes" className="hover:text-primary">
                  Ingredientes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@dulcereposteria.com</li>
              <li>Teléfono: +58 123 456 7890</li>
              <li>Dirección: Av. Principal, Ciudad</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Repostisur C.A. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
