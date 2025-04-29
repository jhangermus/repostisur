"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp"
import { MessageCircle } from "lucide-react"
<<<<<<< HEAD

export function WhatsAppButton() {
  const { items } = useCart()
  
  const handleWhatsAppClick = () => {
    if (items.length === 0) return
    
    const message = generateWhatsAppMessage(items)
    const phoneNumber = "584246687465" // Número de WhatsApp de Repostisur
    const url = getWhatsAppUrl(phoneNumber, message)
    
=======
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  className?: string
}

export function WhatsAppButton({ className }: WhatsAppButtonProps) {
  const { items } = useCart()

  const handleWhatsAppClick = () => {
    if (items.length === 0) return

    const message = generateWhatsAppMessage(items)
    const phoneNumber = "584246687465" // Número de WhatsApp de Repostisur
    const url = getWhatsAppUrl(phoneNumber, message)

>>>>>>> dev
    window.open(url, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      disabled={items.length === 0}
<<<<<<< HEAD
      className="w-full bg-green-600 hover:bg-green-700"
=======
      className={cn("bg-green-600 hover:bg-green-700", className)}
>>>>>>> dev
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Enviar pedido por WhatsApp
    </Button>
  )
<<<<<<< HEAD
} 
=======
}
>>>>>>> dev
