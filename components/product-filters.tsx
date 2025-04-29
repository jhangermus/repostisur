"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { id: "moldes", name: "Moldes" },
  { id: "colorantes", name: "Colorantes" },
  { id: "utensilios", name: "Utensilios" },
  { id: "ingredientes", name: "Ingredientes" },
  { id: "decoracion", name: "Decoración" },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams],
  )

  const selectedCategory = searchParams.get("category") || ""
  const selectedSort = searchParams.get("sort") || ""

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Ordenar por</h3>
        <Select
          value={selectedSort}
          onValueChange={(value) => {
            router.push(`/catalogo?${createQueryString("sort", value)}`, { scroll: false })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
            <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories">
          <AccordionTrigger>Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategory === category.id}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        router.push(`/catalogo?${createQueryString("category", category.id)}`, { scroll: false })
                      } else {
                        router.push(`/catalogo?${createQueryString("category", "")}`, { scroll: false })
                      }
                    }}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          router.push("/catalogo")
        }}
      >
        Limpiar Filtros
      </Button>
    </div>
  )
}
