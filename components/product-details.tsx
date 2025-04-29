"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductById, getRelatedProducts } from "@/lib/products"
import type { Product } from "@/types"
import { ProductCard } from "@/components/product-card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { formatPrice } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Componente para mostrar detalles del producto y relacionados (Cliente)
export function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProductData() {
      setLoading(true)
      try {
        const fetchedProduct = await getProductById(productId)
        if (!fetchedProduct) {
          notFound()
          return
        }
        setProduct(fetchedProduct)

        const fetchedRelated = await getRelatedProducts(fetchedProduct.category, fetchedProduct.id)
        setRelatedProducts(fetchedRelated)
      } catch (error) {
        console.error("Error loading product data:", error)
        // Considerar mostrar un mensaje de error al usuario
      } finally {
        setLoading(false)
      }
    }
    loadProductData()
  }, [productId])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    // Si no se está cargando y no hay producto, podría ser un error.
    // notFound() ya se llamó en useEffect si es necesario.
    return <div className="container py-8">Error al cargar el producto.</div>
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority // Priorizar carga de imagen principal
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
  )
}
