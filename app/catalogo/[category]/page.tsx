import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductList } from "@/components/product-list"
import { ProductFilters } from "@/components/product-filters"
import { notFound } from "next/navigation"
import { Suspense } from "react"

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

// Información de categorías
const categoryInfo = {
  moldes: {
    title: "Moldes para Repostería",
    description:
      "Descubre nuestra amplia selección de moldes para todo tipo de creaciones. Desde moldes de silicona hasta moldes metálicos para tartas, cupcakes y más.",
    tips: [
      "Los moldes de silicona son ideales para desmoldar fácilmente",
      "Para tartas altas, elige moldes con paredes de al menos 7 cm",
      "Los moldes antiadherentes reducen la necesidad de engrasar",
    ],
  },
  colorantes: {
    title: "Colorantes para Repostería",
    description:
      "Colorantes alimentarios de alta calidad para dar vida a tus creaciones. Disponemos de colorantes en gel, líquidos y en polvo para diferentes aplicaciones.",
    tips: [
      "Los colorantes en gel son más concentrados y no alteran la consistencia",
      "Añade el color poco a poco hasta conseguir el tono deseado",
      "Para tonos pastel, usa cantidades muy pequeñas de colorante",
    ],
  },
  utensilios: {
    title: "Utensilios de Repostería",
    description:
      "Herramientas profesionales para facilitar tu trabajo en la cocina. Batidoras, espátulas, mangas pasteleras y todo lo que necesitas para la repostería.",
    tips: [
      "Invierte en una buena batidora si haces repostería con frecuencia",
      "Las espátulas de silicona son ideales para raspar recipientes",
      "Un termómetro de cocina es esencial para trabajar con chocolate y caramelo",
    ],
  },
  ingredientes: {
    title: "Ingredientes para Repostería",
    description:
      "Ingredientes de primera calidad para tus recetas. Harinas especiales, azúcares, esencias, chocolates y más para resultados profesionales.",
    tips: [
      "La temperatura de los ingredientes afecta el resultado final",
      "Para mejores resultados, usa ingredientes a temperatura ambiente",
      "El azúcar glas casero se puede hacer moliendo azúcar regular",
    ],
  },
  decoracion: {
    title: "Decoración para Repostería",
    description:
      "Todo lo que necesitas para dar el toque final a tus creaciones. Sprinkles, perlas comestibles, fondant y herramientas de decoración.",
    tips: [
      "El fondant debe amasarse bien antes de extenderlo",
      "Para decoraciones con glaseado, deja que el pastel se enfríe completamente",
      "Los sprinkles deben aplicarse cuando el glaseado aún está húmedo",
    ],
  },
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  // Verificar si la categoría existe
  if (!Object.keys(categoryInfo).includes(category)) {
    notFound()
  }

  const info = categoryInfo[category as keyof typeof categoryInfo]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{info.title}</h1>
            <p className="text-muted-foreground">{info.description}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <Suspense fallback={<FiltersLoadingSkeleton />}>
                <ProductFilters />
              </Suspense>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Consejos útiles:</h3>
                <ul className="space-y-2 text-sm">
                  {info.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:w-3/4">
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
