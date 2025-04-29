import { type NextRequest, NextResponse } from "next/server"
import {
  getFilteredProducts,
  getFeaturedProducts,
  getProductById,
  getRelatedProducts,
  saveProduct,
  deleteProduct,
  initializeDB,
} from "@/lib/db"
import { getToken } from "next-auth/jwt"

// Inicializar la base de datos (se ejecuta en la primera solicitud)
let dbInitialized = false

// Helper para verificar si el usuario es administrador
async function isAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  return token?.role === "admin"
}

// GET /api/products
export async function GET(req: NextRequest) {
  // Inicializar la base de datos si aún no se ha hecho
  if (!dbInitialized) {
    await initializeDB()
    dbInitialized = true
  }

  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  const category = url.searchParams.get("category") || undefined
  const sort = url.searchParams.get("sort") || undefined
  const featured = url.searchParams.get("featured") === "true"
  const related = url.searchParams.get("related")

  try {
    // Si se solicita un producto por ID
    if (id) {
      const product = await getProductById(id)
      if (!product) {
        return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
      }
      return NextResponse.json(product)
    }

    // Si se solicitan productos relacionados
    if (related && category) {
      const relatedProducts = await getRelatedProducts(category, related)
      return NextResponse.json(relatedProducts)
    }

    // Si se solicitan productos destacados
    if (featured) {
      const featuredProducts = await getFeaturedProducts()
      return NextResponse.json(featuredProducts)
    }

    // Si se solicitan productos filtrados
    const products = await getFilteredProducts({ category, sort })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// POST /api/products (crear nuevo producto)
export async function POST(req: NextRequest) {
  // Verificar si el usuario es administrador
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  try {
    const product = await req.json()
    const savedProduct = await saveProduct(product)
    return NextResponse.json(savedProduct, { status: 201 })
  } catch (error) {
    console.error("Error al guardar producto:", error)
    return NextResponse.json({ error: "Error al guardar producto" }, { status: 500 })
  }
}

// PUT /api/products?id=123 (actualizar producto existente)
export async function PUT(req: NextRequest) {
  // Verificar si el usuario es administrador
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de producto no proporcionado" }, { status: 400 })
  }

  try {
    const productData = await req.json()
    const product = { ...productData, id }
    const updatedProduct = await saveProduct(product)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

// DELETE /api/products?id=123
export async function DELETE(req: NextRequest) {
  // Verificar si el usuario es administrador
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de producto no proporcionado" }, { status: 400 })
  }

  try {
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
