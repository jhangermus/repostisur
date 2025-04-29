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
  // Construir la URL con los parámetros de consulta
  const params = new URLSearchParams()
<<<<<<< HEAD
  if (category) params.append('category', category)
  if (sort) params.append('sort', sort)
  
  try {
    const response = await fetch(`/api/products?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }
    return response.json()
  } catch (error) {
    console.error('Error al obtener productos:', error)
=======
  if (category) params.append("category", category)
  if (sort) params.append("sort", sort)

  try {
    const response = await fetch(`/api/products?${params.toString()}`)
    if (!response.ok) {
      throw new Error("Error al obtener productos")
    }
    return response.json()
  } catch (error) {
    console.error("Error al obtener productos:", error)
>>>>>>> dev
    return []
  }
}

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
<<<<<<< HEAD
    const response = await fetch('/api/products?featured=true')
    if (!response.ok) {
      throw new Error('Error al obtener productos destacados')
    }
    return response.json()
  } catch (error) {
    console.error('Error al obtener productos destacados:', error)
=======
    const response = await fetch("/api/products?featured=true")
    if (!response.ok) {
      throw new Error("Error al obtener productos destacados")
    }
    return response.json()
  } catch (error) {
    console.error("Error al obtener productos destacados:", error)
>>>>>>> dev
    return []
  }
}

// Get a product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`/api/products?id=${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
<<<<<<< HEAD
      throw new Error('Error al obtener producto')
=======
      throw new Error("Error al obtener producto")
>>>>>>> dev
    }
    return response.json()
  } catch (error) {
    console.error(`Error al obtener producto con ID ${id}:`, error)
    return null
  }
}

// Get related products (same category, excluding the current product)
export const getRelatedProducts = async (category: string, currentProductId: string): Promise<Product[]> => {
  try {
    const response = await fetch(`/api/products?category=${category}&related=${currentProductId}`)
    if (!response.ok) {
<<<<<<< HEAD
      throw new Error('Error al obtener productos relacionados')
    }
    return response.json()
  } catch (error) {
    console.error('Error al obtener productos relacionados:', error)
=======
      throw new Error("Error al obtener productos relacionados")
    }
    return response.json()
  } catch (error) {
    console.error("Error al obtener productos relacionados:", error)
>>>>>>> dev
    return []
  }
}

// Save a product (create or update)
export const saveProduct = async (product: Product): Promise<Product> => {
  try {
<<<<<<< HEAD
    const method = product.id ? 'PUT' : 'POST'
    const url = product.id ? `/api/products?id=${product.id}` : '/api/products'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    
    if (!response.ok) {
      throw new Error('Error al guardar producto')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error al guardar producto:', error)
=======
    const method = product.id ? "PUT" : "POST"
    const url = product.id ? `/api/products?id=${product.id}` : "/api/products"

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      throw new Error("Error al guardar producto")
    }

    return response.json()
  } catch (error) {
    console.error("Error al guardar producto:", error)
>>>>>>> dev
    throw error
  }
}

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/products?id=${id}`, {
<<<<<<< HEAD
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Error al eliminar producto')
=======
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Error al eliminar producto")
>>>>>>> dev
    }
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${id}:`, error)
    throw error
  }
}
