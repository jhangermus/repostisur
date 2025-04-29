"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1 || product.stock <= 0}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-4 w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={increaseQuantity}
          disabled={quantity >= product.stock || product.stock <= 0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button className="w-full" onClick={handleAddToCart} disabled={product.stock <= 0}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Añadir al carrito
      </Button>
    </div>
  )
}
