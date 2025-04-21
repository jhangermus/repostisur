"use client"

import type { Product } from "@/types"

// Mock data for products
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Molde de Silicona para Cupcakes",
    description: "Molde de silicona de alta calidad para 12 cupcakes. Resistente al calor hasta 230°C.",
    price: 15.99,
    stock: 25,
    category: "moldes",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "2",
    name: "Colorante Alimentario Azul",
    description: "Colorante alimentario azul intenso. Ideal para decoración de pasteles y glaseados.",
    price: 4.99,
    stock: 50,
    category: "colorantes",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "3",
    name: "Batidora de Mano Profesional",
    description: "Batidora de mano profesional con 5 velocidades. Potencia de 300W.",
    price: 89.99,
    stock: 10,
    category: "utensilios",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "4",
    name: "Harina de Repostería Premium",
    description: "Harina de repostería de alta calidad. Paquete de 1kg.",
    price: 3.49,
    stock: 100,
    category: "ingredientes",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "5",
    name: "Set de Boquillas para Decoración",
    description: "Set de 24 boquillas para decoración de pasteles y cupcakes.",
    price: 19.99,
    stock: 15,
    category: "decoracion",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
  {
    id: "6",
    name: "Molde para Tartas Desmontable",
    description: "Molde para tartas desmontable de 26cm de diámetro. Antiadherente.",
    price: 12.99,
    stock: 20,
    category: "moldes",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
  {
    id: "7",
    name: "Esencia de Vainilla Natural",
    description: "Esencia de vainilla 100% natural. Botella de 100ml.",
    price: 8.99,
    stock: 30,
    category: "ingredientes",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
  {
    id: "8",
    name: "Termómetro Digital para Repostería",
    description: "Termómetro digital con sonda para repostería. Rango de -50°C a 300°C.",
    price: 14.99,
    stock: 5,
    category: "utensilios",
    imageUrl: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
]

// In a real application, this would be a database call
// For now, we'll use localStorage to persist data
const getStoredProducts = (): Product[] => {
  if (typeof window === "undefined") return MOCK_PRODUCTS

  const storedProducts = localStorage.getItem("products")
  if (!storedProducts) {
    localStorage.setItem("products", JSON.stringify(MOCK_PRODUCTS))
    return MOCK_PRODUCTS
  }

  return JSON.parse(storedProducts)
}

const setStoredProducts = (products: Product[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("products", JSON.stringify(products))
}

// Get all products with optional filtering
export const getProducts = async ({
  category,
  sort,
}: {
  category?: string
  sort?: string
}): Promise<Product[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let products = getStoredProducts()

  // Filter by category if provided
  if (category) {
    products = products.filter((product) => product.category === category)
  }

  // Sort products if sort parameter is provided
  if (sort) {
    switch (sort) {
      case "price-asc":
        products = products.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        products = products.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        products = products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        products = products.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }
  }

  return products
}

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await getProducts({})
  return products.filter((product) => product.featured)
}

// Get a product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const products = getStoredProducts()
  return products.find((product) => product.id === id) || null
}

// Get related products (same category, excluding the current product)
export const getRelatedProducts = async (category: string, currentProductId: string): Promise<Product[]> => {
  const products = await getProducts({})
  return products.filter((product) => product.category === category && product.id !== currentProductId).slice(0, 4) // Limit to 4 related products
}

// Save a product (create or update)
export const saveProduct = async (product: Product): Promise<Product> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const products = getStoredProducts()
  const existingProductIndex = products.findIndex((p) => p.id === product.id)

  if (existingProductIndex !== -1) {
    // Update existing product
    products[existingProductIndex] = product
  } else {
    // Add new product
    products.push(product)
  }

  setStoredProducts(products)
  return product
}

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const products = getStoredProducts()
  const updatedProducts = products.filter((product) => product.id !== id)
  setStoredProducts(updatedProducts)
}
