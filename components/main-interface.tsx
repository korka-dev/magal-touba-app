"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { WelcomePage } from "@/components/welcome-page"
import { MapView } from "@/components/map-view"
import { SearchBar } from "@/components/search-bar"
import { LocationCard } from "@/components/location-card"
import { RouteOptionsDialog } from "@/components/route-options-dialog"
import { ActiveRoutePanel } from "@/components/active-route-panel"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { mockLocations, type Location, TOUBA_CENTER } from "@/lib/mock-data"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { ResponsableInterface } from "@/components/responsable-interface"

export function MainInterface() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<Location["type"] | null>(null)
  const [showRoute, setShowRoute] = useState(false)
  const [showRouteOptions, setShowRouteOptions] = useState(false)
  const [routeMode, setRouteMode] = useState<"car" | "bike" | "walk" | null>(null)
  const [checkedInLocations, setCheckedInLocations] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          () => {
            setUserLocation(TOUBA_CENTER)
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0,
          },
        )
      } else {
        setUserLocation(TOUBA_CENTER)
      }
    } catch (error) {
      setUserLocation(TOUBA_CENTER)
    }
  }, [])

  const filteredLocations = searchQuery
    ? mockLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : activeFilter
      ? mockLocations.filter((location) => location.type === activeFilter)
      : mockLocations

  const handleLocationSelect = (location: Location) => {
    console.log("[MapClick] Location selected:", location.name)
    setSelectedLocation(location)
    setShowRoute(false)
    setRouteMode(null)
  }

  const handleGetDirections = (location: Location) => {
    console.log("[Directions] Opening route options for:", location.name)
    setShowRouteOptions(true)
  }

  const handleSelectRoute = (mode: "car" | "bike" | "walk") => {
    console.log("[Route] Selected mode:", mode)
    setRouteMode(mode)
    setShowRoute(true)
    
    toast({
      title: "Navigation démarrée",
      description: `Itinéraire ${mode === "car" ? "en voiture" : mode === "bike" ? "à vélo" : "à pied"} vers ${selectedLocation?.name}`,
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

  const handleCloseLocation = () => {
    setSelectedLocation(null)
    setShowRoute(false)
    setRouteMode(null)
  }

  const calculateDistance = () => {
    if (!userLocation || !selectedLocation) return 0
    const R = 6371
    const dLat = ((selectedLocation.lat - userLocation.lat) * Math.PI) / 180
    const dLon = ((selectedLocation.lng - userLocation.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((selectedLocation.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const calculateDuration = () => {
    if (!routeMode) return ""
    const distance = calculateDistance()
    const speeds = { car: 30, bike: 15, walk: 5 }
    const hours = distance / speeds[routeMode]
    const minutes = Math.round(hours * 60)
    
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      return m > 0 ? `${h}h ${m}min` : `${h}h`
    }
  }

  const categories = [
    { type: "dahira" as const, label: "Dahiras", color: "bg-purple-500" },
    { type: "thiante" as const, label: "Thiantes", color: "bg-violet-500" },
    { type: "eau" as const, label: "Point d'eau", color: "bg-blue-500" },
    { type: "urgence" as const, label: "Urgence", color: "bg-red-500" },
    { type: "mosquee" as const, label: "Mosquée", color: "bg-green-600" },
  ]

  if (!user) {
    return <WelcomePage onLogin={() => {}} />
  }

  if (user.role === "responsable") {
    return <ResponsableInterface />
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={activeFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(null)}
              className="shrink-0"
            >
              Tout
            </Button>
            {categories.map((category) => (
              <Button
                key={category.type}
                variant={activeFilter === category.type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category.type)}
                className="shrink-0"
              >
                <div className={`w-2 h-2 rounded-full ${category.color} mr-2`} />
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 relative z-0">
        <MapView
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          showRoute={showRoute}
          routeMode={routeMode}
          userLocation={userLocation}
          searchQuery={searchQuery}
          activeCategory={activeFilter}
        />

        {/* Modal d'informations du lieu */}
        <Dialog 
          open={!!selectedLocation && !showRoute} 
          onOpenChange={(open) => !open && handleCloseLocation()}
        >
          <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-0 z-[100]">
            {selectedLocation && (
              <>
                <DialogTitle className="sr-only">{selectedLocation.name}</DialogTitle>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 z-10 rounded-full bg-background/80 backdrop-blur hover:bg-background"
                    onClick={handleCloseLocation}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="p-6">
                    <LocationCard
                      location={selectedLocation}
                      onGetDirections={() => handleGetDirections(selectedLocation)}
                      onCheckIn={() => handleCheckIn(selectedLocation)}
                      userHasCheckedIn={checkedInLocations.has(selectedLocation.id)}
                    />
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de choix de mode de transport */}
        {selectedLocation && (
          <RouteOptionsDialog
            open={showRouteOptions}
            onOpenChange={setShowRouteOptions}
            location={selectedLocation}
            userLocation={userLocation}
            onSelectRoute={handleSelectRoute}
          />
        )}

        {/* Panneau de navigation active */}
        {showRoute && selectedLocation && routeMode && (
          <ActiveRoutePanel
            location={selectedLocation}
            mode={routeMode}
            distance={calculateDistance()}
            duration={calculateDuration()}
            onClose={handleCloseLocation}
          />
        )}
      </main>

      <div className="border-t bg-background/95 backdrop-blur p-4">
        <div className="container mx-auto">
          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query)
              setActiveFilter(null)
            }}
            placeholder="Rechercher un lieu..."
          />
        </div>
      </div>
    </div>
  )
}