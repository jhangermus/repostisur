import Link from "next/link"
import { Construction } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
              <TooltipProvider>
                <li>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/catalogo?category=moldes" className="hover:text-primary flex items-center">
                        Moldes
                        <Construction className="h-3 w-3 ml-1 text-muted-foreground" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sección en desarrollo</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/catalogo?category=colorantes" className="hover:text-primary flex items-center">
                        Colorantes
                        <Construction className="h-3 w-3 ml-1 text-muted-foreground" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sección en desarrollo</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/catalogo?category=utensilios" className="hover:text-primary flex items-center">
                        Utensilios
                        <Construction className="h-3 w-3 ml-1 text-muted-foreground" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sección en desarrollo</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/catalogo?category=ingredientes" className="hover:text-primary flex items-center">
                        Ingredientes
                        <Construction className="h-3 w-3 ml-1 text-muted-foreground" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sección en desarrollo</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              </TooltipProvider>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: repostisurca@gmail.com</li>
              <li>Teléfono: +58 424 668 7465</li>
              <li>Dirección: San Francisco, Zulia, Venezuela</li>
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
