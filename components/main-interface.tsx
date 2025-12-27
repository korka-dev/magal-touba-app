"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { MapView } from "@/components/map-view"
import { SearchBar } from "@/components/search-bar"
import { LocationCard } from "@/components/location-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockLocations, type Location, TOUBA_CENTER } from "@/lib/mock-data"
import {
  Droplets,
  Phone,
  MapPin,
  Navigation,
  Home,
  Shield,
  ShoppingBag,
  Armchair,
  Activity,
  LogOut,
  User,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResponsableInterface } from "@/components/responsable-interface"

export function MainInterface() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<Location["type"] | "all">("all")
  const [showRoute, setShowRoute] = useState(false)
  const [checkedInLocations, setCheckedInLocations] = useState<Set<string>>(new Set())
  const [mosqueeSheetOpen, setMosqueeSheetOpen] = useState(false)
  const [locationsSheetOpen, setLocationsSheetOpen] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          console.log("[v0] Position obtenue:", position.coords)
        },
        (error) => {
          let errorMessage = "Impossible d'obtenir votre position"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permission de géolocalisation refusée. Utilisation de la position par défaut."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Position non disponible. Utilisation de la position par défaut."
              break
            case error.TIMEOUT:
              errorMessage = "Délai d'attente dépassé. Utilisation de la position par défaut."
              break
          }

          console.warn("[v0]", errorMessage, error.message)

          // Fallback to Touba center
          setUserLocation(TOUBA_CENTER)

          toast({
            title: "Géolocalisation",
            description: errorMessage,
            variant: "default",
          })
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      setUserLocation(TOUBA_CENTER)
      toast({
        title: "Géolocalisation non disponible",
        description: "Utilisation de la position par défaut (Touba)",
      })
    }
  }, [toast])

  const filteredLocations = mockLocations.filter((location) => {
    const matchesSearch =
      searchQuery === "" ||
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === "all" || location.type === activeFilter

    return matchesSearch && matchesFilter
  })

  const handleGetDirections = (location: Location) => {
    setSelectedLocation(location)
    setShowRoute(true)
    setMosqueeSheetOpen(false)
    setLocationsSheetOpen(false)
    toast({
      title: "Navigation démarrée",
      description: `Itinéraire vers ${location.name}`,
    })
  }

  const handleStopNavigation = () => {
    setShowRoute(false)
    setSelectedLocation(null)
    toast({
      title: "Navigation arrêtée",
      description: "Vous pouvez chercher un nouveau lieu",
    })
  }

  const handleCheckIn = (location: Location) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour vous enregistrer",
        variant: "destructive",
      })
      return
    }

    setCheckedInLocations((prev) => new Set(prev).add(location.id))

    toast({
      title: "Enregistrement réussi",
      description: `Vous êtes maintenant enregistré à ${location.name}`,
    })
  }

  const filterButtons = [
    { type: "all" as const, label: "Tous", icon: MapPin },
    { type: "dahira" as const, label: "Dahiras", icon: Home },
    { type: "thiante" as const, label: "Thiantes", icon: Activity },
    { type: "eau" as const, label: "Eau", icon: Droplets },
    { type: "urgence" as const, label: "Urgences", icon: Phone },
    { type: "toilette" as const, label: "Toilettes", icon: Home },
    { type: "securite" as const, label: "Sécurité", icon: Shield },
    { type: "boutique" as const, label: "Boutiques", icon: ShoppingBag },
    { type: "repos" as const, label: "Repos", icon: Armchair },
  ]

  const mosqueeLocation = mockLocations.find((loc) => loc.type === "mosquee")

  if (user?.role === "responsable") {
    return <ResponsableInterface />
  }

  // Default interface for pèlerins
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col flex-shrink-0">
            <h1 className="text-base md:text-lg font-bold text-primary leading-tight">Magal Touba 2025</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Guide du Pèlerin</p>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end overflow-x-auto">
            <Sheet open={mosqueeSheetOpen} onOpenChange={setMosqueeSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  <Home className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mosquée</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Grande Mosquée de Touba</SheetTitle>
                  <SheetDescription>Informations et horaires</SheetDescription>
                </SheetHeader>
                {mosqueeLocation && (
                  <div className="mt-4 space-y-4">
                    <Card className="border-primary">
                      <CardContent className="pt-6 space-y-4">
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm mb-1">Horaires de visite</p>
                              <p className="text-sm text-muted-foreground">{mosqueeLocation.horaires}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Informations importantes</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Tenue décente obligatoire</li>
                            <li>Retirer vos chaussures avant d'entrer</li>
                            <li>Respecter le silence et la prière</li>
                            <li>Photos autorisées à l'extérieur uniquement</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Adresse:</span> {mosqueeLocation.address}
                          </p>
                        </div>

                        <Button onClick={() => handleGetDirections(mosqueeLocation)} className="w-full">
                          <Navigation className="h-4 w-4 mr-2" />
                          Obtenir l'itinéraire
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Sheet open={locationsSheetOpen} onOpenChange={setLocationsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Lieux</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Tous les lieux</SheetTitle>
                  <SheetDescription>Rechercher et filtrer les lieux</SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {filterButtons.map(({ type, label, icon: Icon }) => (
                      <Button
                        key={type}
                        variant={activeFilter === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter(type)}
                        className="text-xs"
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {label}
                      </Button>
                    ))}
                  </div>

                  <ScrollArea className="h-[calc(80vh-200px)]">
                    <div className="space-y-2 pr-4">
                      {filteredLocations.length === 0 ? (
                        <Card>
                          <CardContent className="py-8 text-center text-muted-foreground">
                            Aucun lieu trouvé
                          </CardContent>
                        </Card>
                      ) : (
                        filteredLocations.map((location) => (
                          <LocationCard
                            key={location.id}
                            location={location}
                            onGetDirections={() => handleGetDirections(location)}
                            onCheckIn={() => handleCheckIn(location)}
                            userHasCheckedIn={checkedInLocations.has(location.id)}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  <User className="h-4 w-4" />
                  <span className="ml-1 hidden md:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="text-xs text-muted-foreground">
                    {user?.role === "admin" ? "Administrateur" : "Pèlerin"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <MapView
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={(location) => {
            setSelectedLocation(location)
            setShowRoute(false)
          }}
          showRoute={showRoute}
          userLocation={userLocation}
        />

        {showRoute && selectedLocation && (
          <div className="absolute top-4 right-4 z-10">
            <Button variant="destructive" size="sm" onClick={handleStopNavigation} className="shadow-lg">
              Arrêter
            </Button>
          </div>
        )}
      </main>

      <div className="border-t bg-background/95 backdrop-blur p-4">
        <div className="container mx-auto">
          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query)
              if (query) {
                setLocationsSheetOpen(true)
              }
            }}
            placeholder="Rechercher un lieu..."
          />
        </div>
      </div>
    </div>
  )
}
