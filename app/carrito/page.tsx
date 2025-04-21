"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, ArrowLeft, ShoppingBag, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateItemQuantity, clearCart } = useCart()

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleCheckout = () => {
    if (items.length === 0) return

    // Prepare the WhatsApp message
    const message = items
      .map(
        (item) =>
          `*${item.name}* - ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`,
      )
      .join("\n")

    const totalMessage = `\n\n*Total:* ${formatPrice(totalPrice)}`

    const fullMessage = `¡Hola! Me gustaría realizar el siguiente pedido:\n\n${message}${totalMessage}`

    // Encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(fullMessage)

    // WhatsApp phone number - replace with your actual number
    const phoneNumber = "584123456789"

    // Create the WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    // Clear the cart after checkout
    clearCart()

    // Redirect to home page
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-medium mt-4">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mt-2">Parece que aún no has añadido productos a tu carrito</p>
              <Button className="mt-6" asChild>
                <Link href="/catalogo">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continuar comprando
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-lg border shadow-sm">
                  <div className="p-6 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b last:border-0"
                      >
                        <div className="relative h-20 w-20 rounded-md overflow-hidden">
                          <Image
                            src={item.imageUrl || "/placeholder.svg?height=80&width=80"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateItemQuantity(item.id, item.quantity - 1)
                                }
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="h-8 px-3 flex items-center justify-center border-y">{item.quantity}</div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => {
                                if (item.quantity < item.stock) {
                                  updateItemQuantity(item.id, item.quantity + 1)
                                }
                              }}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg border shadow-sm p-6 space-y-4">
                  <h2 className="text-xl font-medium">Resumen del pedido</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleCheckout}>
                    Finalizar compra
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/catalogo">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continuar comprando
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
