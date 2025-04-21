"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProducts } from "@/lib/products"
import type { Product } from "@/types"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductList() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') ?? undefined
  const sort = searchParams.get('sort') ?? undefined

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const fetchedProducts = await getProducts({ category, sort })
        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Error loading products:", error)
        // Handle error appropriately
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [category, sort]) // Reload when category or sort changes

  if (loading) {
    // Mostrar esqueletos mientras carga
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron productos con los filtros seleccionados.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
} 