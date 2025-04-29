import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface CategoryCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

export function CategoryCard({ title, description, icon, href }: CategoryCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-center mb-4 text-primary">{icon}</div>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">{/* Contenido adicional si es necesario */}</CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={href} className="flex items-center justify-center">
            Ver productos
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
