import { kv } from '@vercel/kv'
import type { Product } from '@/types'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

// Clave para almacenar los productos en Vercel KV
const PRODUCTS_KEY = 'bakery:products'

// Inicializar la base de datos con datos de muestra si está vacía
export async function initializeDB() {
  const productsExist = await kv.exists(PRODUCTS_KEY)
  
  if (!productsExist) {
    console.log('Inicializando la base de datos con productos de muestra...')
    await kv.set(PRODUCTS_KEY, MOCK_PRODUCTS)
  }
}

// Obtener todos los productos
export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await kv.get<Product[]>(PRODUCTS_KEY)
    return products || []
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return []
  }
}

// Obtener productos filtrados
export async function getFilteredProducts({ 
  category, 
  sort 
}: { 
  category?: string, 
  sort?: string 
}): Promise<Product[]> {
  try {
    let products = await getAllProducts()
    
    // Filtrar por categoría
    if (category) {
      products = products.filter(p => p.category === category)
    }
    
    // Ordenar productos
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products = products.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          products = products.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          products = products.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          products = products.sort((a, b) => b.name.localeCompare(a.name))
          break
      }
    }
    
    return products
  } catch (error) {
    console.error('Error al filtrar productos:', error)
    return []
  }
}

// Obtener productos destacados
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    return products.filter(product => product.featured)
  } catch (error) {
    console.error('Error al obtener productos destacados:', error)
    return []
  }
}

// Obtener un producto por ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await getAllProducts()
    return products.find(p => p.id === id) || null
  } catch (error) {
    console.error(`Error al obtener producto con ID ${id}:`, error)
    return null
  }
}

// Obtener productos relacionados
export async function getRelatedProducts(category: string, currentProductId: string): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    return products
      .filter(p => p.category === category && p.id !== currentProductId)
      .slice(0, 4) // Limitar a 4 productos relacionados
  } catch (error) {
    console.error('Error al obtener productos relacionados:', error)
    return []
  }
}

// Guardar un producto (crear o actualizar)
export async function saveProduct(product: Product): Promise<Product> {
  try {
    const products = await getAllProducts()
    const existingIndex = products.findIndex(p => p.id === product.id)
    
    if (existingIndex !== -1) {
      // Actualizar producto existente
      products[existingIndex] = product
    } else {
      // Añadir nuevo producto
      products.push(product)
    }
    
    await kv.set(PRODUCTS_KEY, products)
    return product
  } catch (error) {
    console.error('Error al guardar producto:', error)
    throw new Error('No se pudo guardar el producto')
  }
}

// Eliminar un producto
export async function deleteProduct(id: string): Promise<void> {
  try {
    const products = await getAllProducts()
    const filteredProducts = products.filter(p => p.id !== id)
    
    await kv.set(PRODUCTS_KEY, filteredProducts)
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${id}:`, error)
    throw new Error('No se pudo eliminar el producto')
  }
} 