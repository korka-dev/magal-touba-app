"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Users, 
  CheckCircle2,
  Clock,
  Info
} from "lucide-react"
import type { Location } from "@/lib/mock-data"

interface LocationCardProps {
  location: Location
  onGetDirections: () => void
  onCheckIn: () => void
  userHasCheckedIn: boolean
}

export function LocationCard({ location, onGetDirections, onCheckIn, userHasCheckedIn }: LocationCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      mosquee: { label: "Mosquée", color: "bg-green-600" },
      dahira: { label: "Dahira", color: "bg-purple-500" },
      thiante: { label: "Thiante", color: "bg-violet-500" },
      eau: { label: "Point d'eau", color: "bg-blue-500" },
      urgence: { label: "Urgence", color: "bg-red-500" },
      toilette: { label: "Toilettes", color: "bg-purple-600" },
      securite: { label: "Sécurité", color: "bg-orange-500" },
      boutique: { label: "Boutique", color: "bg-teal-500" },
      repos: { label: "Repos", color: "bg-green-500" },
    }
    return labels[type] || { label: type, color: "bg-gray-500" }
  }

  const typeInfo = getTypeLabel(location.type)

  return (
    <div className="space-y-4">
      {/* En-tête avec titre et badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold text-foreground pr-8">{location.name}</h2>
          <Badge className={`${typeInfo.color} text-white shrink-0`}>
            {typeInfo.label}
          </Badge>
        </div>

        {/* Adresse */}
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm">{location.address}</p>
        </div>
      </div>

      <Separator />

      {/* Informations détaillées */}
      <div className="space-y-3">
        {location.responsable && (
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Responsable: </span>
              <span className="font-medium">{location.responsable}</span>
            </span>
          </div>
        )}

        {location.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`tel:${location.phone}`} 
              className="text-sm font-medium text-primary hover:underline"
            >
              {location.phone}
            </a>
          </div>
        )}

        {location.capacity && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Capacité: </span>
              <span className="font-medium">{location.capacity} personnes</span>
            </span>
          </div>
        )}

        {location.visiteurs !== undefined && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Visiteurs actuels: </span>
              <span className="font-medium text-primary">{location.visiteurs}</span>
            </span>
          </div>
        )}

        {location.horaires && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">
              <span className="text-muted-foreground">Horaires: </span>
              <span className="font-medium">{location.horaires}</span>
            </span>
          </div>
        )}
      </div>

      {/* Services disponibles */}
      {location.services && location.services.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Services disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {location.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Consignes spéciales */}
      {location.consignes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Consignes</h3>
            <p className="text-sm text-muted-foreground">{location.consignes}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Boutons d'action */}
      <div className="flex flex-col gap-2">
        <Button 
          onClick={onGetDirections} 
          className="w-full"
          size="lg"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Voir l'itinéraire
        </Button>

        <Button
          onClick={onCheckIn}
          variant={userHasCheckedIn ? "secondary" : "outline"}
          className="w-full"
          size="lg"
          disabled={userHasCheckedIn}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {userHasCheckedIn ? "Déjà enregistré" : "S'enregistrer ici"}
        </Button>
      </div>
    </div>
  )
}