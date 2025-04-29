import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FeaturedProducts } from "@/components/featured-products"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl mb-8 text-center">
              Productos Destacados
            </h2>
            <FeaturedProducts />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
