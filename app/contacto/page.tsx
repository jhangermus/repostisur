import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Contacto</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  Información de Contacto
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <span>+58 424 668 7465</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-primary" />
                    <span>repostisurca@gmail.com</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary mt-1" />
                    <span>San Francisco, Zulia, Venezuela</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Horario de Atención
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg overflow-hidden h-[450px] shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.5076016672!2d-71.65956!3d10.6926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e89c9e91d796de7%3A0xe91d796de790f051!2sRepostisur%20C.%20A!5e0!3m2!1ses!2sve!4v1714503000000!5m2!1ses!2sve"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Repostisur C.A"
              aria-label="Mapa de Google mostrando la ubicación de Repostisur C.A en San Francisco, Zulia, Venezuela"
            ></iframe>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://www.google.com/maps/place/Repostisur+C.+A/data=!4m2!3m1!1s0x0:0xe91d796de790f051?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
