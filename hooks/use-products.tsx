"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/types"
import { getProducts } from "@/lib/products"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const data = await getProducts({})
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error desconocido"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const totalProducts = products.length
  const lowStockProducts = products.filter((product) => product.stock <= 5).length

  return {
    products,
    isLoading,
    error,
    totalProducts,
    lowStockProducts,
    refetch: fetchProducts,
  }
}
