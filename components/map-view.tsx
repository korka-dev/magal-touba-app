"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import type { Location } from "@/lib/mock-data"

interface MapViewProps {
  locations: Location[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
  showRoute: boolean
  routeMode: "car" | "bike" | "walk" | null
  userLocation?: { lat: number; lng: number }
  searchQuery: string
  activeCategory: string | null
}

export function MapView({ 
  locations, 
  selectedLocation, 
  onLocationSelect, 
  showRoute, 
  routeMode,
  userLocation 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const routeLayerRef = useRef<any>(null)
  const userMarkerRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (typeof window === "undefined") return

    if ((window as any).L && (window as any).L.polylineDecorator) {
      setLeafletLoaded(true)
      return
    }

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => {
      // Charger le plugin polyline decorator
      const decoratorScript = document.createElement("script")
      decoratorScript.src = "https://unpkg.com/leaflet-polylinedecorator@1.6.0/dist/leaflet.polylineDecorator.js"
      decoratorScript.async = true
      decoratorScript.onload = () => {
        setLeafletLoaded(true)
      }
      decoratorScript.onerror = () => {
        // Si le plugin échoue, continuer quand même
        setLeafletLoaded(true)
      }
      document.head.appendChild(decoratorScript)
    }
    document.head.appendChild(script)

    return () => {
      link.remove()
      script.remove()
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || leafletMapRef.current) return

    const L = (window as any).L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [14.8516, -15.8777],
      zoom: 14,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map)

    leafletMapRef.current = map
    setIsLoading(false)

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [leafletLoaded])

  // Update user location marker
  useEffect(() => {
    if (!leafletMapRef.current || !leafletLoaded || !userLocation) return

    const L = (window as any).L
    if (!L) return

    // Remove old user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }

    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: '<div style="width: 16px; height: 16px; background: #4285F4; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    })

    const marker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      title: "Votre position",
    }).addTo(leafletMapRef.current)

    userMarkerRef.current = marker
  }, [leafletLoaded, userLocation])

  // Update markers when locations change
  useEffect(() => {
    if (!leafletMapRef.current || !leafletLoaded) return

    const L = (window as any).L
    if (!L) return

    console.log("[MapView] Updating markers, locations count:", locations.length)

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add markers for filtered locations
    locations.forEach((location) => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: getMarkerHTML(location.type),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([location.lat, location.lng], {
        icon,
        title: location.name,
        interactive: true,
        bubblingMouseEvents: false,
        riseOnHover: true,
      })

      // Attacher l'événement click
      marker.on("click", (e: any) => {
        console.log("[MapView] Marker clicked:", location.name)
        // Empêcher la propagation de l'événement
        if (e.originalEvent) {
          e.originalEvent.stopPropagation()
        }
        L.DomEvent.stopPropagation(e)
        // Appeler la fonction de sélection
        onLocationSelect(location)
      })

      marker.addTo(leafletMapRef.current)
      markersRef.current.push(marker)
    })

    console.log("[MapView] Total markers added:", markersRef.current.length)
  }, [leafletLoaded, locations, onLocationSelect])

  // Center map on selected location ONLY when route is shown
  useEffect(() => {
    if (selectedLocation && leafletMapRef.current && showRoute) {
      // En mode itinéraire, on ajuste pour voir tout le trajet
      // Le fitBounds est déjà géré dans l'effet de route
    }
  }, [selectedLocation, showRoute])

  // Draw route when navigation is active
  useEffect(() => {
    if (!leafletMapRef.current || !leafletLoaded || !showRoute || !selectedLocation || !userLocation || !routeMode) {
      if (routeLayerRef.current) {
        routeLayerRef.current.remove()
        routeLayerRef.current = null
      }
      return
    }

    const L = (window as any).L
    if (!L) return

    if (routeLayerRef.current) {
      routeLayerRef.current.remove()
    }

    const routeCoordinates = [
      [userLocation.lat, userLocation.lng],
      [selectedLocation.lat, selectedLocation.lng],
    ]

    // Couleurs et styles selon le mode de transport
    const routeStyles = {
      car: { color: "#4285F4", weight: 5, dashArray: undefined },
      bike: { color: "#34A853", weight: 4, dashArray: "8, 4" },
      walk: { color: "#EA4335", weight: 4, dashArray: "4, 8" },
    }

    const style = routeStyles[routeMode]

    const routeLine = L.polyline(routeCoordinates, {
      color: style.color,
      weight: style.weight,
      opacity: 0.9,
      dashArray: style.dashArray,
      lineJoin: "round",
      lineCap: "round",
    })

    routeLine.addTo(leafletMapRef.current)
    routeLayerRef.current = routeLine

    // Ajouter des flèches directionnelles si le plugin est disponible
    if (L.polylineDecorator) {
      const arrow = L.polylineDecorator(routeLine, {
        patterns: [
          {
            offset: "50%",
            repeat: 0,
            symbol: L.Symbol.arrowHead({
              pixelSize: 15,
              polygon: false,
              pathOptions: {
                stroke: true,
                weight: 3,
                color: style.color,
                opacity: 0.9,
              },
            }),
          },
        ],
      })
      arrow.addTo(leafletMapRef.current)
    }

    const bounds = L.latLngBounds(routeCoordinates)
    leafletMapRef.current.fitBounds(bounds, { padding: [80, 80] })
  }, [leafletLoaded, showRoute, selectedLocation, userLocation, routeMode])

  return (
    <>
      <div ref={mapRef} className="h-full w-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </>
  )
}

function getMarkerHTML(type: string): string {
  const colors: Record<string, string> = {
    mosquee: "#059669",
    dahira: "#7C3AED",
    thiante: "#8B5CF6",
    eau: "#0EA5E9",
    urgence: "#DC2626",
    toilette: "#9333EA",
    securite: "#F97316",
    boutique: "#14B8A6",
    repos: "#22C55E",
  }

  const color = colors[type] || "#F59E0B"

  return `
    <div style="
      width: 32px;
      height: 32px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      pointer-events: auto;
      transition: transform 0.2s ease;
    "></div>
  `
}