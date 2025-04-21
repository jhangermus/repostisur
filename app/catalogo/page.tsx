"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductFilters } from "@/components/product-filters"
import { ProductList } from "@/components/product-list"
import { Suspense } from 'react'

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
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <Suspense fallback={<FiltersLoadingSkeleton />}>
                <ProductFilters />
              </Suspense>
            </div>
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold mb-6">Catálogo de Productos</h1>
              {/* Envolver ProductList con Suspense para una mejor UX de carga */}
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
