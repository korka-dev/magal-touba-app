"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, Bell, Info, Users, Droplet, Phone } from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"
import { useState } from "react"

interface WelcomePageProps {
  onLogin: () => void
}

export function WelcomePage({ onLogin }: WelcomePageProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const handleShowAuth = () => {
    setShowAuthDialog(true)
  }

  const handleAuthSuccess = (open: boolean) => {
    setShowAuthDialog(open)
    if (!open) {
      onLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Magal de Touba</h1>
              <p className="text-xs text-muted-foreground">Gestion des Pèlerins</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleShowAuth}>
            Connexion
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">Bienvenue au Magal de Touba</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Facilitez votre pèlerinage avec notre plateforme de gestion complète. Localisez les lieux sacrés, les
            services essentiels et restez informé en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={handleShowAuth} className="text-base">
              Créer un compte
            </Button>
            <Button size="lg" variant="outline" onClick={handleShowAuth} className="text-base bg-transparent">
              Se connecter
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">5000+</div>
            <div className="text-sm text-muted-foreground mt-1">Pèlerins Inscrits</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground mt-1">Points d'Intérêt</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground mt-1">Assistance Disponible</div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">Fonctionnalités Accessibles</h3>
        <p className="text-center text-muted-foreground mb-12">
          Tout ce dont vous avez besoin pour une expérience optimale
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Clock className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Horaires</h4>
            <p className="text-sm text-muted-foreground">
              Consultez tous les horaires des événements et cérémonies du Magal
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <MapPin className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Lieux</h4>
            <p className="text-sm text-muted-foreground">Recherchez et découvrez les lieux importants autour de vous</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Bell className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Recevez des alertes en temps réel sur les événements importants
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Info className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Informations</h4>
            <p className="text-sm text-muted-foreground">Accédez aux informations pratiques pour votre pèlerinage</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Dahiras & Thiantes</h4>
            <p className="text-sm text-muted-foreground">
              Localisez et enregistrez votre présence dans les lieux de rassemblement
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Droplet className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Points d'Eau</h4>
            <p className="text-sm text-muted-foreground">Trouvez les points d'eau les plus proches de votre position</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Phone className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Urgences</h4>
            <p className="text-sm text-muted-foreground">Accès rapide aux services d'urgence et sapeurs-pompiers</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Info className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-lg mb-2">Utilités</h4>
            <p className="text-sm text-muted-foreground">
              Toilettes, postes de sécurité, boutiques et espaces de repos
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à commencer ?</h3>
          <p className="text-primary-foreground/90 mb-6">
            Rejoignez des milliers de pèlerins qui utilisent déjà notre plateforme pour faciliter leur expérience au
            Magal de Touba.
          </p>
          <Button size="lg" variant="secondary" onClick={handleShowAuth} className="text-base">
            Créer un compte gratuitement
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Magal de Touba - Tous droits réservés</p>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={showAuthDialog} onOpenChange={handleAuthSuccess} />
    </div>
  )
}

