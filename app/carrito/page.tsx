"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Trash2 } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCart()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
  }, [items])

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
        <p>Tu carrito está vacío</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Carrito de Compras</h1>
        <Button
          variant="destructive"
          onClick={clearCart}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Vaciar Carrito
        </Button>
      </div>

      <div className="grid gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium">Total</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </div>

        <WhatsAppButton />
      </div>
    </div>
  )
}
