import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { getProducts } from "@/lib/products"

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const products = await getProducts({
    category: searchParams.category as string,
    sort: searchParams.sort as string,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <ProductFilters />
            </div>
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold mb-6">Catálogo de Productos</h1>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron productos con los filtros seleccionados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
