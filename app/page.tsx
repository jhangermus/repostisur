import Link from "next/link"
import { ArrowRight, Cake, Package, ShoppingBag, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/products"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Todo para tu <span className="text-primary">repostería</span> en un solo{" "}
                  <span className="text-secondary">lugar</span>
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Encuentra los mejores insumos, materiales al mayor y materia prima para tus creaciones.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/catalogo">
                    <Button size="lg" className="w-full sm:w-auto">
                      Ver Catálogo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contacto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Contáctanos
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full bg-secondary/20 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                    <Cake className="h-24 w-24 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">¿Por qué elegirnos?</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Ofrecemos la mejor calidad y servicio para tus proyectos de repostería
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Amplio Catálogo</h3>
                <p className="text-muted-foreground mt-2">Miles de productos para todas tus necesidades</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-secondary/10 p-4 rounded-full mb-4">
                  <Package className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Calidad Premium</h3>
                <p className="text-muted-foreground mt-2">Productos de la más alta calidad</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Envío Rápido</h3>
                <p className="text-muted-foreground mt-2">Entrega rápida a todo el país</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-secondary/10 p-4 rounded-full mb-4">
                  <Cake className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Asesoría</h3>
                <p className="text-muted-foreground mt-2">Te ayudamos a elegir los mejores productos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Productos Destacados</h2>
                <p className="mt-4 text-muted-foreground">Descubre nuestros productos más populares</p>
              </div>
              <Link href="/catalogo" className="mt-4 md:mt-0">
                <Button variant="outline">
                  Ver todo el catálogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">¿Listo para comenzar?</h2>
            <p className="mt-4 text-primary-foreground/80 md:text-xl max-w-[700px] mx-auto">
              Explora nuestro catálogo y encuentra todo lo que necesitas para tus proyectos de repostería
            </p>
            <div className="mt-8">
              <Link href="/catalogo">
                <Button size="lg" variant="secondary" className="text-secondary-foreground">
                  Explorar Catálogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
