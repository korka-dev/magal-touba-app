"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Navigation, Clock, MapPin, Car, Bike, Footprints, TrendingUp } from "lucide-react"
import type { Location } from "@/lib/mock-data"

interface ActiveRoutePanelProps {
  location: Location
  mode: "car" | "bike" | "walk"
  distance: number
  duration: string
  onClose: () => void
}

export function ActiveRoutePanel({ location, mode, distance, duration, onClose }: ActiveRoutePanelProps) {
  const getModeConfig = () => {
    switch (mode) {
      case "car":
        return {
          icon: Car,
          label: "En voiture",
          color: "text-blue-600",
          bg: "bg-blue-50",
          gradient: "from-blue-500 to-blue-600",
        }
      case "bike":
        return {
          icon: Bike,
          label: "À vélo",
          color: "text-green-600",
          bg: "bg-green-50",
          gradient: "from-green-500 to-green-600",
        }
      case "walk":
        return {
          icon: Footprints,
          label: "À pied",
          color: "text-orange-600",
          bg: "bg-orange-50",
          gradient: "from-orange-500 to-orange-600",
        }
    }
  }

  const modeConfig = getModeConfig()
  const ModeIcon = modeConfig.icon

  return (
    <Card className="absolute top-4 left-4 right-4 z-[50] bg-background/98 backdrop-blur-lg border-2 shadow-2xl mx-auto max-w-md overflow-hidden">
      {/* Barre de couleur en haut */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${modeConfig.gradient}`} />
      
      <div className="p-4 space-y-4">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`flex items-center justify-center w-12 h-12 ${modeConfig.bg} rounded-xl shrink-0 animate-pulse`}>
              <Navigation className={`h-6 w-6 ${modeConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Navigation active</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
              <p className="font-bold text-base truncate mt-1">{location.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-3 gap-3">
          {/* Mode de transport */}
          <div className={`${modeConfig.bg} rounded-lg p-3 text-center border border-border/50`}>
            <ModeIcon className={`h-5 w-5 ${modeConfig.color} mx-auto mb-1.5`} />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Mode</p>
            <p className={`text-xs font-bold ${modeConfig.color} mt-0.5`}>{modeConfig.label}</p>
          </div>

          {/* Durée */}
          <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/20">
            <Clock className="h-5 w-5 text-primary mx-auto mb-1.5" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Durée</p>
            <p className="text-xs font-bold text-primary mt-0.5">{duration}</p>
          </div>

          {/* Distance */}
          <div className="bg-muted rounded-lg p-3 text-center border border-border">
            <TrendingUp className="h-5 w-5 text-foreground mx-auto mb-1.5" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Distance</p>
            <p className="text-xs font-bold text-foreground mt-0.5">{distance.toFixed(1)} km</p>
          </div>
        </div>

        {/* Instruction */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </div>
          <p className="text-xs text-blue-900 font-medium">
            Suivez la ligne {mode === "car" ? "bleue" : mode === "bike" ? "verte" : "rouge"} sur la carte pour rejoindre votre destination
          </p>
        </div>
      </div>
    </Card>
  )
}