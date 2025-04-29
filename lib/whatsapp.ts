import type { CartItem } from "@/hooks/use-cart"

export const generateWhatsAppMessage = (items: CartItem[]): string => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const message =
    `¡Hola! Soy un cliente de Repostisur y me gustaría realizar el siguiente pedido:\n\n` +
    items
      .map(
        (item) =>
          `📦 *${item.name}*\n` +
          `   Cantidad: ${item.quantity}\n` +
          `   Precio unitario: $${item.price.toFixed(2)}\n` +
          `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`,
      )
      .join("\n") +
    `\n💰 *Total del pedido:* $${total.toFixed(2)}\n\n` +
    `Por favor, confírmame la disponibilidad de los productos y el total final del pedido. ¡Gracias!`

  return encodeURIComponent(message)
}

export const getWhatsAppUrl = (phoneNumber: string, message: string): string => {
  return `https://wa.me/${phoneNumber}?text=${message}`
}
