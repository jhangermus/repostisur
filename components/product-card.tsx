"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">{formatPrice(product.price)}</p>
          {product.stock > 0 ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-100">
              En stock
            </span>
          ) : (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-100">
              Agotado
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/producto/${product.id}`}>Ver detalles</Link>
        </Button>
        <Button size="sm" className="w-full" onClick={() => addItem(product)} disabled={product.stock <= 0}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  )
}
