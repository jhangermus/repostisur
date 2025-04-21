import Image from "next/image"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getProductById, getRelatedProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { formatPrice } from "@/lib/utils"

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-2xl font-bold mt-2 text-primary">{formatPrice(product.price)}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-2">Descripción</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-2">Disponibilidad</h2>
                {product.stock > 0 ? (
                  <p className="text-green-600 dark:text-green-400">En stock ({product.stock} disponibles)</p>
                ) : (
                  <p className="text-red-600 dark:text-red-400">Agotado</p>
                )}
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
