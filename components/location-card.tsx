"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Location } from "@/lib/mock-data"
import { MapPin, Users, Phone, Navigation, CheckCircle } from "lucide-react"

interface LocationCardProps {
  location: Location
  onGetDirections?: () => void
  onCheckIn?: () => void
  userHasCheckedIn?: boolean
}

const typeLabels: Record<Location["type"], string> = {
  mosquee: "Mosquée",
  thiante: "Thiante",
  dahira: "Dahira",
  eau: "Point d'eau",
  urgence: "Service d'urgence",
  toilette: "Toilettes",
  securite: "Sécurité",
  boutique: "Boutique",
  repos: "Espace de repos",
}

const typeColors: Record<Location["type"], string> = {
  mosquee: "bg-primary text-primary-foreground",
  thiante: "bg-accent text-accent-foreground",
  dahira: "bg-accent text-accent-foreground",
  eau: "bg-blue-500 text-white",
  urgence: "bg-red-500 text-white",
  toilette: "bg-purple-500 text-white",
  securite: "bg-orange-500 text-white",
  boutique: "bg-teal-500 text-white",
  repos: "bg-green-500 text-white",
}

export function LocationCard({ location, onGetDirections, onCheckIn, userHasCheckedIn }: LocationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{location.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{location.address}</span>
            </CardDescription>
          </div>
          <Badge className={typeColors[location.type]}>{typeLabels[location.type]}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {location.horaires && <p className="text-sm text-muted-foreground">{location.horaires}</p>}

        {location.responsable && (
          <p className="text-sm">
            <span className="font-medium">{"Responsable: "}</span>
            {location.responsable}
          </p>
        )}

        {location.capacity && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {"Capacité: "}
              {location.capacity} {" personnes"}
            </span>
          </div>
        )}

        {location.visiteurs !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {location.visiteurs} {" visiteurs présents"}
            </span>
          </div>
        )}

        {location.services && location.services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {location.services.map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        )}

        {location.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${location.phone}`} className="text-primary hover:underline">
              {location.phone}
            </a>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onGetDirections && (
            <Button onClick={onGetDirections} className="flex-1" size="sm">
              <Navigation className="h-4 w-4 mr-2" />
              Itinéraire
            </Button>
          )}

          {onCheckIn && (location.type === "dahira" || location.type === "thiante") && (
            <Button
              onClick={onCheckIn}
              variant={userHasCheckedIn ? "secondary" : "default"}
              className="flex-1"
              size="sm"
              disabled={userHasCheckedIn}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {userHasCheckedIn ? "Arrivé" : "J'arrive"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
