"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

interface CartItem extends Product {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: Product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          const updatedItems = items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
          set({ items: updatedItems })
        } else {
          set({ items: [...items, { ...item, quantity }] })
        }
      },
      removeItem: (id: string) => {
        const { items } = get()
        set({ items: items.filter((i) => i.id !== id) })
      },
      updateItemQuantity: (id: string, quantity: number) => {
        const { items } = get()
        set({
          items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })
      },
      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
