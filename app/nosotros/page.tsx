import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Construction } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="container py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Construction className="h-24 w-24 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Sitio en Construcción</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Estamos trabajando en esta sección. Vuelva pronto para conocer más sobre Repostisur C.A.
            </p>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
