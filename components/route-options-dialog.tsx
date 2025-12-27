"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Car, Bike, Footprints, Clock, MapPin, ArrowRight } from "lucide-react"
import type { Location } from "@/lib/mock-data"

interface RouteOptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: Location
  userLocation?: { lat: number; lng: number }
  onSelectRoute: (mode: "car" | "bike" | "walk") => void
}

export function RouteOptionsDialog({
  open,
  onOpenChange,
  location,
  userLocation,
  onSelectRoute,
}: RouteOptionsDialogProps) {
  // Calculer la distance approximative en km
  const calculateDistance = () => {
    if (!userLocation) return 0
    const R = 6371 // Rayon de la Terre en km
    const dLat = ((location.lat - userLocation.lat) * Math.PI) / 180
    const dLon = ((location.lng - userLocation.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((location.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const distance = calculateDistance()

  // Calculer le temps estimé pour chaque mode
  const calculateTime = (mode: "car" | "bike" | "walk") => {
    const speeds = {
      car: 30, // km/h en ville
      bike: 15, // km/h
      walk: 5, // km/h
    }
    const hours = distance / speeds[mode]
    const minutes = Math.round(hours * 60)
    
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      return m > 0 ? `${h}h ${m}min` : `${h}h`
    }
  }

  const routeOptions = [
    {
      mode: "car" as const,
      icon: Car,
      label: "En voiture",
      time: calculateTime("car"),
      description: "Le plus rapide",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      mode: "bike" as const,
      icon: Bike,
      label: "À vélo",
      time: calculateTime("bike"),
      description: "Écologique",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      mode: "walk" as const,
      icon: Footprints,
      label: "À pied",
      time: calculateTime("walk"),
      description: "Découverte",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0">
        <DialogTitle className="sr-only">Choisir un mode de transport</DialogTitle>
        
        {/* En-tête avec dégradé */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 pb-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-primary/20 rounded-full" />
            <h2 className="text-xl font-bold">Choisir un itinéraire</h2>
          </div>
          
          {/* Destination */}
          <div className="flex items-start gap-3 p-4 bg-background/80 backdrop-blur rounded-xl border shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{location.name}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{location.address}</p>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Distance:</span>
            <span className="font-bold text-primary text-lg">{distance.toFixed(1)} km</span>
          </div>
        </div>

        {/* Options de transport */}
        <div className="p-6 space-y-3">
          {routeOptions.map((option) => (
            <button
              key={option.mode}
              onClick={() => {
                onSelectRoute(option.mode)
                onOpenChange(false)
              }}
              className="w-full group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 p-4 bg-background">
                {/* Icône */}
                <div className={`flex items-center justify-center w-14 h-14 ${option.iconBg} rounded-xl shrink-0 transition-transform group-hover:scale-110`}>
                  <option.icon className={`h-7 w-7 ${option.iconColor}`} />
                </div>
                
                {/* Contenu */}
                <div className="flex-1 text-left">
                  <p className="font-bold text-base">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-semibold text-primary">{option.time}</span>
                  </div>
                </div>

                {/* Flèche */}
                <div className="shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Barre de couleur en bas */}
              <div className={`h-1 w-full bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </button>
          ))}
        </div>

        {/* Note en bas */}
        <div className="px-6 pb-6 pt-0">
          <p className="text-xs text-center text-muted-foreground bg-muted/50 rounded-lg p-3">
            ⏱️ Les temps sont estimés et peuvent varier selon les conditions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}