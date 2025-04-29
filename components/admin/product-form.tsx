"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProductById, saveProduct } from "@/lib/products"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  stock: z.coerce.number().int().nonnegative({
    message: "El stock debe ser un número entero no negativo.",
  }),
  category: z.string({
    required_error: "Por favor selecciona una categoría.",
  }),
  imageUrl: z
    .string()
    .url({
      message: "Por favor ingresa una URL válida para la imagen.",
    })
    .optional()
    .or(z.literal("")),
})

interface ProductFormProps {
  productId: string | null
  onCancel: () => void
  onSuccess: () => void
}

export function ProductForm({ productId, onCancel, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(!!productId)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
    },
  })

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        setIsFetchingInitialData(true)
        try {
          const product = await getProductById(productId)
          if (product) {
            form.reset({
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
              category: product.category,
              imageUrl: product.imageUrl || "",
            })
          } else {
            console.error(`Product with ID ${productId} not found.`)
          }
        } catch (error) {
          console.error("Error fetching product data:", error)
        } finally {
          setIsFetchingInitialData(false)
        }
      }
    }

    loadProduct()
  }, [productId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await saveProduct({
        id: productId || crypto.randomUUID(),
        featured: false,
        ...values,
        imageUrl: values.imageUrl || undefined,
      })
      onSuccess()
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetchingInitialData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando datos del producto...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{productId ? "Editar Producto" : "Añadir Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="moldes">Moldes</SelectItem>
                        <SelectItem value="colorantes">Colorantes</SelectItem>
                        <SelectItem value="utensilios">Utensilios</SelectItem>
                        <SelectItem value="ingredientes">Ingredientes</SelectItem>
                        <SelectItem value="decoracion">Decoración</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>URL de la imagen</FormLabel>
                    <FormControl>
                      <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>Deja en blanco para usar una imagen predeterminada</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción del producto"
                        className="resize-none"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onCancel} type="button" disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isFetchingInitialData}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
