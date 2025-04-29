"use client"

import { useState } from "react"
import { Package, Plus, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductTable } from "@/components/admin/product-table"
import { ProductForm } from "@/components/admin/product-form"
import { useProducts } from "@/hooks/use-products"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products")
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const { products, totalProducts, lowStockProducts } = useProducts()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos con Poco Stock</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>
          {activeTab === "products" && !isAddingProduct && !editingProduct && (
            <Button onClick={() => setIsAddingProduct(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Producto
            </Button>
          )}
        </div>
        <TabsContent value="products" className="space-y-4">
          {isAddingProduct || editingProduct ? (
            <ProductForm
              productId={editingProduct}
              onCancel={() => {
                setIsAddingProduct(false)
                setEditingProduct(null)
              }}
              onSuccess={() => {
                setIsAddingProduct(false)
                setEditingProduct(null)
              }}
            />
          ) : (
            <ProductTable products={products} onEdit={(id) => setEditingProduct(id)} />
          )}
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Los pedidos se gestionan a través de WhatsApp. Esta sección estará disponible en futuras
                actualizaciones.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
