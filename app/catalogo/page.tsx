"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CategoryCard } from "@/components/category-card"
import { Cake, Palette, Utensils, ShoppingBag, Sparkles } from "lucide-react"
import { Suspense } from "react"
import { ProductFilters } from "@/components/product-filters"
import { ProductList } from "@/components/product-list"

// Componente de carga para Suspense
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-[200px] w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

// Componente de carga para filtros
function FiltersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}

export default function CatalogoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Catálogo de Productos</h1>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Categorías</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <CategoryCard
                title="Moldes"
                description="Moldes para todo tipo de creaciones"
                icon={<Cake className="h-12 w-12" />}
                href="/catalogo/moldes"
              />
              <CategoryCard
                title="Colorantes"
                description="Dale color a tus creaciones"
                icon={<Palette className="h-12 w-12" />}
                href="/catalogo/colorantes"
              />
              <CategoryCard
                title="Utensilios"
                description="Herramientas profesionales"
                icon={<Utensils className="h-12 w-12" />}
                href="/catalogo/utensilios"
              />
              <CategoryCard
                title="Ingredientes"
                description="Ingredientes de calidad"
                icon={<ShoppingBag className="h-12 w-12" />}
                href="/catalogo/ingredientes"
              />
              <CategoryCard
                title="Decoración"
                description="Para el toque final"
                icon={<Sparkles className="h-12 w-12" />}
                href="/catalogo/decoracion"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <Suspense fallback={<FiltersLoadingSkeleton />}>
                <ProductFilters />
              </Suspense>
            </div>
            <div className="md:w-3/4">
              <h2 className="text-2xl font-semibold mb-6">Todos los Productos</h2>
              <Suspense fallback={<LoadingSkeleton />}>
                <ProductList />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
