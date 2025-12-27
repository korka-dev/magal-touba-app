"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AuthDialog } from "@/components/auth-dialog"
import {
  MapPin,
  Navigation,
  Droplets,
  Phone,
  Users,
  Shield,
} from "lucide-react"
import Image from "next/image"

export function LandingPage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const features = [
    {
      icon: MapPin,
      title: "Géolocalisation",
      description: "Trouvez facilement les lieux importants autour de vous",
    },
    {
      icon: Navigation,
      title: "Navigation GPS",
      description: "Itinéraires précis pour vous déplacer sereinement",
    },
    {
      icon: Users,
      title: "Dahiras & Thiantes",
      description: "Découvrez les événements religieux et enregistrez votre présence",
    },
    {
      icon: Droplets,
      title: "Points d'eau",
      description: "Localisez rapidement les points d'eau potable",
    },
    {
      icon: Phone,
      title: "Services d'urgence",
      description: "Accès rapide aux services médicaux et d'urgence",
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Repérez les postes de sécurité et de police à proximité",
    },
  ]

  return (
    <>
      {/* Conteneur principal avec structure flex */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b bg-green-600/95 backdrop-blur-sm text-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/images/logo-magal.png"
                  alt="Magal Touba Logo"
                  fill
                  className="rounded-full object-cover border-2 border-white"
                />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Magal bu Touba
                </h1>
                <p className="text-xs md:text-sm opacity-90">
                  Téere bu wayfar
                </p>
              </div>
            </div>
            <Button
              onClick={() => setAuthDialogOpen(true)}
              size="lg"
              className="bg-white text-green-600 hover:bg-white/90 hover:text-green-600"
            >
              Se connecter
            </Button>
          </div>
        </header>

        {/* Espacement entre header et hero */}
        <div className="h-12 md:h-16"></div>

        {/* Contenu principal avec flex-1 */}
        <div className="flex-1">
          {/* Hero section */}
          <section className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">
                <span className="text-primary">
                  Dalal ak jamm ci Magal bu Touba
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Votre compagnon numérique pour vivre pleinement le pèlerinage.
                Accédez à tous les services essentiels, naviguez facilement et
                restez connecté.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => setAuthDialogOpen(true)}
                  size="lg"
                  className="text-lg px-8 bg-green-600 hover:bg-green-600/90"
                >
                  Commencer maintenant
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent text-green-600 border-green-600 hover:bg-green-600/10"
                  asChild
                >
                  <a href="#features">En savoir plus</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Features section */}
          <section id="features" className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h3 className="text-2xl md:text-4xl font-bold">
                  Fonctionnalités complètes
                </h3>
                <p className="text-muted-foreground text-lg">
                  Tout ce dont vous avez besoin pour un pèlerinage serein
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow border-green-50"
                  >
                    <CardHeader>
                      <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-green-600 mb-2" />
                      <CardTitle className="text-base md:text-lg">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA section */}
          <section className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Prêt à commencer votre pèlerinage ?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Connectez-vous maintenant et accédez à tous les services
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => setAuthDialogOpen(true)}
                  size="lg"
                  className="text-lg px-8 bg-green-600 hover:bg-green-600/90"
                >
                  Se connecter maintenant
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer toujours en bas */}
        <footer className="border-t bg-background w-full py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Magal bu Touba  – Guide du Pèlerin</p>
          </div>
        </footer>
      </div>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
      />
    </>
  )
}
