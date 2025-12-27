"use client"

import { useEffect, useRef, useState } from "react"
import { loadGoogleMapsScript } from "@/lib/google-maps-loader"
import { TOUBA_CENTER, type Location } from "@/lib/mock-data"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "lucide-react"

declare global {
  interface Window {
    google: any
  }
}

interface MapViewProps {
  locations: Location[]
  selectedLocation?: Location | null
  onLocationSelect?: (location: Location) => void
  showRoute?: boolean
  userLocation?: { lat: number; lng: number }
  apiKey?: string
}

export function MapView({ locations, selectedLocation, onLocationSelect, showRoute, userLocation }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<any[]>([])
  const directionsRendererRef = useRef<any>(null)
  const [routeDetails, setRouteDetails] = useState<{
    distance: string
    duration: string
    steps: Array<{ instructions: string; distance: string; duration: string }>
  } | null>(null)

  useEffect(() => {
    const initMap = async () => {
      console.log("[v0] Initialisation de la carte Google Maps...")
      try {
        await loadGoogleMapsScript()
        console.log("[v0] Script Google Maps chargé avec succès")

        if (!window.google || !window.google.maps) {
          throw new Error("Google Maps n'est pas disponible")
        }

        if (mapRef.current && !map) {
          console.log("[v0] Création de la carte...")
          const newMap = new window.google.maps.Map(mapRef.current, {
            center: TOUBA_CENTER,
            zoom: 14,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: "poi",
                stylers: [{ visibility: "off" }],
              },
            ],
          })

          console.log("[v0] Carte créée avec succès")
          setMap(newMap)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("[v0] Erreur lors du chargement de Google Maps:", error)
        setError(error instanceof Error ? error.message : "Erreur inconnue")
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Add location markers
  useEffect(() => {
    if (!map || !window.google) {
      console.log("[v0] Carte ou Google Maps non disponible pour ajouter les marqueurs")
      return
    }

    console.log("[v0] Ajout de", locations.length, "marqueurs sur la carte")

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    const getMarkerIcon = (type: Location["type"]) => {
      const colors: Record<Location["type"], string> = {
        mosquee: "#6B7A3F",
        thiante: "#9B8B5F",
        dahira: "#9B8B5F",
        eau: "#4A90E2",
        urgence: "#E24A4A",
        toilette: "#8B7A9B",
        securite: "#E2A84A",
        boutique: "#5F8B9B",
        repos: "#7AB56B",
      }

      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: colors[type],
        fillOpacity: 0.9,
        strokeColor: "#fff",
        strokeWeight: 2,
        scale: 10,
      }
    }

    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: getMarkerIcon(location.type),
      })

      marker.addListener("click", () => {
        onLocationSelect?.(location)
      })

      markersRef.current.push(marker)
    })

    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map,
        title: "Votre position",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
          scale: 8,
        },
      })
      markersRef.current.push(userMarker)
    }

    console.log("[v0] Marqueurs ajoutés avec succès")
  }, [map, locations, onLocationSelect, userLocation])

  // Handle route display
  useEffect(() => {
    if (!map || !showRoute || !selectedLocation || !userLocation || !window.google) {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
      }
      setRouteDetails(null)
      return
    }

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#6B7A3F",
          strokeWeight: 6,
          strokeOpacity: 0.8,
        },
      })
    }

    const directionsService = new window.google.maps.DirectionsService()

    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result)

          const route = result.routes[0]
          const leg = route.legs[0]

          setRouteDetails({
            distance: leg.distance?.text || "",
            duration: leg.duration?.text || "",
            steps:
              leg.steps?.map((step) => ({
                instructions: step.instructions?.replace(/<[^>]*>/g, "") || "",
                distance: step.distance?.text || "",
                duration: step.duration?.text || "",
              })) || [],
          })
        }
      },
    )
  }, [map, showRoute, selectedLocation, userLocation])

  // Pan to selected location
  useEffect(() => {
    if (map && selectedLocation) {
      map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng })
      map.setZoom(16)
    }
  }, [map, selectedLocation])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted p-6 text-center gap-3">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">Erreur de chargement</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "400px" }} />
      {routeDetails && showRoute && selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-10">
          <Card className="shadow-lg border-2">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{selectedLocation.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{selectedLocation.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 px-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="text-sm font-semibold">{routeDetails.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-muted-foreground">Durée</p>
                    <p className="text-sm font-semibold">{routeDetails.duration}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground">Instructions étape par étape:</p>
                {routeDetails.steps.map((step, index) => (
                  <div key={index} className="flex gap-2 text-xs pb-2 border-b last:border-0">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-tight mb-1">{step.instructions}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.distance} • {step.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
