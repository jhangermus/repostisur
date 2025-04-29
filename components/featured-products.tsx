"use client"

<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { getFeaturedProducts } from "@/lib/products"
import type { Product } from "@/types"
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
=======
import { useState, useEffect } from "react"
import { getFeaturedProducts } from "@/lib/products"
import type { Product } from "@/types"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
>>>>>>> dev

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const featured = await getFeaturedProducts()
        setProducts(featured)
      } catch (error) {
        console.error("Error loading featured products:", error)
        // Handle error appropriately
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    // Puedes mostrar un esqueleto o un indicador de carga aquí
    return <p>Cargando productos destacados...</p>
  }

  if (products.length === 0) {
    return <p>No hay productos destacados disponibles.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <Link href={`/producto/${product.id}`}>
            <AspectRatio ratio={1 / 1} className="bg-muted">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </AspectRatio>
          </Link>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg truncate">
              <Link href={`/producto/${product.id}`}>{product.name}</Link>
            </h3>
<<<<<<< HEAD
            <p className="text-sm text-muted-foreground mb-2 truncate">
              {product.description}
            </p>
=======
            <p className="text-sm text-muted-foreground mb-2 truncate">{product.description}</p>
>>>>>>> dev
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
              <Button size="sm" asChild>
                <Link href={`/producto/${product.id}`}>Ver Detalles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
<<<<<<< HEAD
} 
=======
}
>>>>>>> dev
