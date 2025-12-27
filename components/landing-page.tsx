"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthDialog } from "@/components/auth-dialog"
import { MapPin, Navigation, Droplets, Phone, Shield, Home, Users, Clock } from "lucide-react"

export function LandingPage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const features = [
    {
      icon: Home,
      title: "Grande Mosquée",
      description: "Accédez aux horaires et informations de la Grande Mosquée de Touba",
    },
    {
      icon: MapPin,
      title: "Géolocalisation",
      description: "Trouvez tous les lieux importants autour de vous en temps réel",
    },
    {
      icon: Navigation,
      title: "Navigation GPS",
      description: "Obtenez des itinéraires précis vers n'importe quel lieu",
    },
    {
      icon: Users,
      title: "Dahiras & Thiantes",
      description: "Découvrez et enregistrez votre présence aux événements",
    },
    {
      icon: Droplets,
      title: "Points d'eau",
      description: "Localisez les points d'eau potable les plus proches",
    },
    {
      icon: Phone,
      title: "Services d'urgence",
      description: "Accès rapide aux services médicaux et d'urgence",
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Trouvez les postes de sécurité et de police",
    },
    {
      icon: Clock,
      title: "Disponible 24/7",
      description: "L'application fonctionne à tout moment pendant le Magal",
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-primary">Magal Touba 2025</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Guide du Pèlerin</p>
            </div>
            <Button onClick={() => setAuthDialogOpen(true)} size="lg">
              Se connecter
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-balance">
              Bienvenue au <span className="text-primary">Magal de Touba</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Votre compagnon numérique pour vivre pleinement le pèlerinage. Accédez à tous les services essentiels,
              naviguez facilement et restez connecté.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={() => setAuthDialogOpen(true)} size="lg" className="text-lg px-8">
                Commencer maintenant
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                <a href="#features">En savoir plus</a>
              </Button>
            </div>
          </div>

          {/* Preview Image */}
          <div className="mt-12 md:mt-16 max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <MapPin className="h-24 w-24 text-primary/40" />
              </div>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-2xl md:text-4xl font-bold">Fonctionnalités complètes</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour un pèlerinage serein et organisé
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground">
            <CardHeader className="text-center space-y-4 pb-6">
              <CardTitle className="text-2xl md:text-4xl">Prêt à commencer votre pèlerinage ?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Connectez-vous maintenant et accédez à tous les services du Magal de Touba
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button onClick={() => setAuthDialogOpen(true)} size="lg" variant="secondary" className="text-lg px-8">
                Se connecter maintenant
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur mt-12">
          <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
            <p>Magal Touba 2025 - Guide du Pèlerin - Tous droits réservés</p>
          </div>
        </footer>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  )
}
