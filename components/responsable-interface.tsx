"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
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
import { LogOut, User, Plus, Users, MapPin, Bell, Edit, Trash2, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { mockLocations, type Location } from "@/lib/mock-data"

interface Visitor {
  id: string
  name: string
  phone: string
  checkInTime: Date
  locationId: string
}

interface Notification {
  id: string
  locationId: string
  visitorName: string
  time: Date
  read: boolean
}

export function ResponsableInterface() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState<"dahira" | "thiante">("dahira")
  const [address, setAddress] = useState("")
  const [capacity, setCapacity] = useState("")
  const [services, setServices] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [phone, setPhone] = useState("")

  // Charger les lieux et visiteurs mockés au montage
  useEffect(() => {
    const userLocations = mockLocations.filter(
      (loc) => (loc.type === "dahira" || loc.type === "thiante") && loc.responsable === user?.name,
    )
    setLocations(userLocations)

    // Visiteurs mockés
    const mockVisitors: Visitor[] = [
      {
        id: "1",
        name: "Abdoulaye Diop",
        phone: "+221 77 123 45 67",
        checkInTime: new Date(),
        locationId: userLocations[0]?.id || "1",
      },
      {
        id: "2",
        name: "Fatou Sall",
        phone: "+221 76 234 56 78",
        checkInTime: new Date(Date.now() - 30 * 60000),
        locationId: userLocations[0]?.id || "1",
      },
    ]
    setVisitors(mockVisitors)
  }, [user])

  // Simulation de notifications en temps réel
  useEffect(() => {
    if (locations.length === 0) return

    const interval = setInterval(() => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      if (randomLocation) {
        const newVisitor: Visitor = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Nouveau Visiteur ${Math.floor(Math.random() * 100)}`,
          phone: "+221 77 XXX XX XX",
          checkInTime: new Date(),
          locationId: randomLocation.id,
        }

        setVisitors(prev => [...prev, newVisitor])

        const newNotification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          locationId: randomLocation.id,
          visitorName: newVisitor.name,
          time: new Date(),
          read: false,
        }

        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)

        toast({
          title: "Nouvelle arrivée",
          description: `${newVisitor.name} est arrivé à ${randomLocation.name}`,
        })
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [locations])

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

    if (!name || !address || !latitude || !longitude) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    const newLocation: Location = {
      id: isUpdateMode && selectedLocation ? selectedLocation.id : Math.random().toString(36).substr(2, 9),
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

    if (isUpdateMode && selectedLocation) {
      setLocations(prev => prev.map(loc => loc.id === selectedLocation.id ? newLocation : loc))
      toast({
        title: "Lieu mis à jour",
        description: `Le lieu "${name}" a été mis à jour avec succès`,
      })
    } else {
      setLocations([newLocation, ...locations])
      toast({
        title: "Lieu ajouté avec succès",
        description: `${type === "dahira" ? "Le dahira" : "La thiante"} "${name}" a été créé(e)`,
      })
    }

    resetForm()
    setIsModalOpen(false)
    setIsUpdateMode(false)
    setSelectedLocation(null)
  }

  const resetForm = () => {
    setName("")
    setType("dahira")
    setAddress("")
    setCapacity("")
    setServices("")
    setLatitude("")
    setLongitude("")
    setPhone("")
  }

  const confirmDelete = (location: Location) => {
    setLocationToDelete(location)
    setIsDeleteConfirmOpen(true)
  }

  const handleDelete = () => {
    if (locationToDelete) {
      setLocations(prev => prev.filter(loc => loc.id !== locationToDelete.id))
      toast({
        title: "Lieu supprimé",
        description: `Le lieu "${locationToDelete.name}" a été supprimé avec succès`,
        variant: "destructive",
      })
      setIsDeleteConfirmOpen(false)
      setIsDetailsModalOpen(false)
    }
  }

  const openDetailsModal = (location: Location) => {
    setSelectedLocation(location)
    setIsDetailsModalOpen(true)
  }

  const openUpdateModal = (location: Location) => {
    setSelectedLocation(location)
    setIsUpdateMode(true)
    setIsModalOpen(true)

    setName(location.name)
    setAddress(location.address)
    setLatitude(location.lat.toString())
    setLongitude(location.lng.toString())
    setCapacity(location.capacity?.toString() || "")
    setServices(location.services?.join(", ") || "")
    setPhone(location.phone || "")
  }

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getVisitorsForLocation = (locationId: string) => {
    return visitors.filter(v => v.locationId === locationId)
  }

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center md:bg-fixed"
      style={{
        backgroundImage: "url('/images/touba-mosque.jpg')",
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Header */}
      <header className="border-b bg-background/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Image circulaire ajoutée */}
            <div className="relative h-12 w-12">
              <Image
                src="/images/logo-magal.png"
                alt="Logo Magal Touba"
                fill
                className="rounded-full object-cover border-2 border-primary"
              />
            </div>

            {/* Texte Espace Responsable */}
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-primary">Responsable Dahira</h1>
              <p className="text-xs text-muted-foreground">Magal bu Touba</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    if (unreadCount > 0) markNotificationsAsRead()
                  }}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune notification</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${!notification.read ? 'bg-accent' : ''}`}
                        >
                          <p className="text-sm font-medium">
                            {notification.visitorName} est arrivé à {
                              locations.find(loc => loc.id === notification.locationId)?.name
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

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
        </div>
      </header>

      {/* Message "Dalal ak jamm Djeuwrin" */}
      <div className="py-6 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg py-4 px-6 shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-primary">
              Dalal ak jamm Djeuwrin
            </h2>
          </div>
        </div>
      </div>

      {/* Espacement */}
      <div className="h-8 md:h-12"></div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white w-full md:w-auto text-center md:text-left">
            Activités récentes
          </h2>
          <Button
            onClick={() => {
              setIsUpdateMode(false)
              resetForm()
              setIsModalOpen(true)
            }}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un lieu
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="w-full mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un lieu par nom ou adresse..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des lieux */}
        {filteredLocations.length === 0 ? (
          <Card className="text-center py-12 bg-background/80 w-full">
            <CardContent>
              <p className="text-muted-foreground">Aucun lieu trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 w-full">
            {filteredLocations.map((location) => {
              const locationVisitors = getVisitorsForLocation(location.id)
              return (
                <Card
                  key={location.id}
                  className="hover:shadow-md transition-shadow cursor-pointer bg-background/80 w-full"
                  onClick={() => openDetailsModal(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="w-full md:w-auto">
                        <h3 className="font-medium">{location.name}</h3>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {locationVisitors.length} visiteurs présents
                          </span>
                        </div>
                      </div>
                      <Badge className="w-full md:w-auto text-center">
                        {location.type === "dahira" ? "Dahira" : "Thiante"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background w-full py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Magal Touba 2025 – Guide du Pèlerin</p>
        </div>
      </footer>

      {/* Modale pour ajouter/mettre à jour un lieu */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] bg-background max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isUpdateMode ? "Mettre à jour le lieu" : "Ajouter un nouveau lieu"}
            </DialogTitle>
            <DialogDescription>
              {isUpdateMode ? "Modifiez les informations du lieu" : "Créez un dahira ou une thiante pour accueillir les pèlerins"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de lieu *</Label>
              <Select value={type} onValueChange={(value: "dahira" | "thiante") => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[110]">
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

            <DialogFooter>
              <Button type="submit" className="w-full md:w-auto">
                {isUpdateMode ? "Mettre à jour" : "Créer le lieu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modale pour afficher les détails */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        {selectedLocation && (
          <DialogContent className="sm:max-w-[600px] w-[95vw] bg-background max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLocation.name}</DialogTitle>
              <DialogDescription>
                Détails du {selectedLocation.type === "dahira" ? "dahira" : "thiante"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {selectedLocation.type === "dahira" ? "Dahira" : "Thiante"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Responsable</p>
                  <p className="font-medium">{selectedLocation.responsable}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{selectedLocation.address}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Latitude</p>
                  <p className="font-medium">{selectedLocation.lat}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Longitude</p>
                  <p className="font-medium">{selectedLocation.lng}</p>
                </div>
              </div>

              {selectedLocation.capacity && (
                <div>
                  <p className="text-sm text-muted-foreground">Capacité</p>
                  <p className="font-medium">{selectedLocation.capacity} personnes</p>
                </div>
              )}

              {selectedLocation.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selectedLocation.phone}</p>
                </div>
              )}

              {selectedLocation.services && selectedLocation.services.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedLocation.services.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Visiteurs présents</p>
                <p className="font-medium">
                  {getVisitorsForLocation(selectedLocation.id).length} visiteurs
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => openUpdateModal(selectedLocation)}
                className="w-full md:w-auto"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDelete(selectedLocation)}
                className="w-full md:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Modale de confirmation de suppression */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] bg-background">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{locationToDelete?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} className="w-full md:w-auto">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="w-full md:w-auto">
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
