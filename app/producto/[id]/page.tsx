import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetails } from "@/components/product-details"
<<<<<<< HEAD
import { Suspense } from 'react'
=======
import { Suspense } from "react"
>>>>>>> dev
import { Skeleton } from "@/components/ui/skeleton"

// Componente de carga para Suspense
function LoadingSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    </div>
  )
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductDetails productId={params.id} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
