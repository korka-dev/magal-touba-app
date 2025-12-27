"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User, Plus, Users, MapPin } from "lucide-react"
import { mockLocations, type Location } from "@/lib/mock-data"

interface Visitor {
  id: string
  name: string
  phone: string
  checkInTime: Date
  locationId: string
}

export function ResponsableInterface() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [view, setView] = useState<"add" | "visitors">("add")

  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState<"dahira" | "thiante">("dahira")
  const [address, setAddress] = useState("")
  const [capacity, setCapacity] = useState("")
  const [services, setServices] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [phone, setPhone] = useState("")

  // Mock visitors data
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: "1",
      name: "Abdoulaye Diop",
      phone: "+221 77 123 45 67",
      checkInTime: new Date(),
      locationId: "2",
    },
    {
      id: "2",
      name: "Fatou Sall",
      phone: "+221 76 234 56 78",
      checkInTime: new Date(Date.now() - 30 * 60000),
      locationId: "2",
    },
  ])

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          toast({
            title: "Position obtenue",
            description: "Vos coordonnées GPS ont été récupérées avec succès",
          })
        },
        (error) => {
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive",
          })
        },
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name || !address || !latitude || !longitude) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    // Create new location
    const newLocation: Location = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      address,
      lat: Number.parseFloat(latitude),
      lng: Number.parseFloat(longitude),
      capacity: capacity ? Number.parseInt(capacity) : undefined,
      responsable: user?.name,
      services: services ? services.split(",").map((s) => s.trim()) : undefined,
      phone: phone || undefined,
      visiteurs: 0,
    }

    // In production, this would be sent to backend
    console.log("[v0] New location created:", newLocation)

    toast({
      title: "Lieu ajouté avec succès",
      description: `${type === "dahira" ? "Le dahira" : "La thiante"} "${name}" a été créé(e)`,
    })

    // Reset form
    setName("")
    setAddress("")
    setCapacity("")
    setServices("")
    setLatitude("")
    setLongitude("")
    setPhone("")
  }

  const myLocations = mockLocations.filter(
    (loc) => (loc.type === "dahira" || loc.type === "thiante") && loc.responsable === user?.name,
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-primary">Espace Responsable</h1>
            <p className="text-xs text-muted-foreground">Magal Touba 2025</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                {user?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <span className="text-xs text-muted-foreground">Responsable</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-2">
            <Button variant={view === "add" ? "default" : "ghost"} size="sm" onClick={() => setView("add")}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un lieu
            </Button>
            <Button variant={view === "visitors" ? "default" : "ghost"} size="sm" onClick={() => setView("visitors")}>
              <Users className="h-4 w-4 mr-2" />
              Visiteurs ({visitors.length})
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        {view === "add" ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un nouveau lieu</CardTitle>
                <CardDescription>Créez un dahira ou une thiante pour accueillir les pèlerins</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de lieu *</Label>
                    <Select value={type} onValueChange={(value: "dahira" | "thiante") => setType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dahira">Dahira</SelectItem>
                        <SelectItem value="thiante">Thiante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Dahira Matlaboul Fawzaini"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Textarea
                      id="address"
                      placeholder="Ex: Quartier Darou Khoudoss, Touba"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="Ex: 14.852"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="Ex: -15.881"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Utiliser ma position actuelle
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacité d'accueil</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Ex: 500"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ex: +221 77 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="services">Services (séparés par des virgules)</Label>
                    <Textarea
                      id="services"
                      placeholder="Ex: Hébergement, Restauration, Eau potable"
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le lieu
                  </Button>
                </form>
              </CardContent>
            </Card>

            {myLocations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mes lieux</CardTitle>
                  <CardDescription>Lieux que vous gérez</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myLocations.map((location) => (
                      <div key={location.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{location.name}</h3>
                          <p className="text-sm text-muted-foreground">{location.address}</p>
                          {location.visiteurs !== undefined && (
                            <p className="text-sm text-primary mt-1">{location.visiteurs} visiteurs présents</p>
                          )}
                        </div>
                        <Badge>{location.type === "dahira" ? "Dahira" : "Thiante"}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Liste des visiteurs</CardTitle>
                <CardDescription>Pèlerins qui se sont enregistrés dans vos lieux</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-3">
                    {visitors.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Aucun visiteur enregistré pour le moment</p>
                    ) : (
                      visitors.map((visitor) => {
                        const location = mockLocations.find((loc) => loc.id === visitor.locationId)
                        return (
                          <div key={visitor.id} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-medium">{visitor.name}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{visitor.phone}</p>
                              <p className="text-sm text-primary mt-1">{location?.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {visitor.checkInTime.toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                Présent
                              </Badge>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
