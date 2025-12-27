// Données mockées pour le prototype

export interface Location {
  id: string
  name: string
  type: "mosquee" | "thiante" | "dahira" | "eau" | "urgence" | "toilette" | "securite" | "boutique" | "repos"
  lat: number
  lng: number
  address: string
  capacity?: number
  responsable?: string
  services?: string[]
  phone?: string
  horaires?: string
  visiteurs?: number
  attendees?: Array<{ userId: string; userName: string; checkInTime: Date }>
}

// Coordonnées de Touba, Sénégal
export const TOUBA_CENTER = { lat: 14.85, lng: -15.8833 }

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Grande Mosquée de Touba",
    type: "mosquee",
    lat: 14.852,
    lng: -15.881,
    address: "Centre de Touba",
    horaires: "Visite: 9h-11h et 15h-17h",
  },
  {
    id: "2",
    name: "Dahira Matlaboul Fawzaini",
    type: "dahira",
    lat: 14.848,
    lng: -15.885,
    address: "Quartier Darou Khoudoss",
    capacity: 500,
    responsable: "Serigne Cheikh Fall",
    services: ["Hébergement", "Restauration", "Eau potable"],
    visiteurs: 234,
  },
  {
    id: "3",
    name: "Thiante Keur Serigne Touba",
    type: "thiante",
    lat: 14.846,
    lng: -15.888,
    address: "Quartier Darou Salam",
    capacity: 300,
    responsable: "Serigne Mouhamadou Diop",
    services: ["Enseignement", "Restauration"],
    visiteurs: 156,
  },
  {
    id: "4",
    name: "Point d'eau - Mosquée Massalikoul Jinaan",
    type: "eau",
    lat: 14.851,
    lng: -15.882,
    address: "Près de la mosquée Massalikoul Jinaan",
  },
  {
    id: "5",
    name: "Point d'eau - Marché central",
    type: "eau",
    lat: 14.849,
    lng: -15.884,
    address: "Marché central de Touba",
  },
  {
    id: "6",
    name: "Sapeurs-Pompiers Zone Nord",
    type: "urgence",
    lat: 14.855,
    lng: -15.88,
    address: "Zone Nord, Route de Mbacké",
    phone: "800 00 18 18",
  },
  {
    id: "7",
    name: "Poste de Secours Centre",
    type: "urgence",
    lat: 14.8515,
    lng: -15.8825,
    address: "Centre-ville, Av. Cheikh Ahmadou Bamba",
    phone: "800 00 18 19",
  },
  {
    id: "8",
    name: "Toilettes Publiques Place de la Mosquée",
    type: "toilette",
    lat: 14.8525,
    lng: -15.8815,
    address: "Place de la Grande Mosquée",
  },
  {
    id: "9",
    name: "Toilettes Publiques Marché",
    type: "toilette",
    lat: 14.8492,
    lng: -15.8842,
    address: "Marché central",
  },
  {
    id: "10",
    name: "Poste de Sécurité Principal",
    type: "securite",
    lat: 14.8518,
    lng: -15.8828,
    address: "Entrée principale de la mosquée",
    phone: "33 975 50 50",
  },
  {
    id: "11",
    name: "Boutique Essentiels du Pèlerin",
    type: "boutique",
    lat: 14.8495,
    lng: -15.8845,
    address: "Rue du Commerce",
    services: ["Eau embouteillée", "Nattes de prière", "Vêtements"],
  },
  {
    id: "12",
    name: "Espace de Repos Ombre & Paix",
    type: "repos",
    lat: 14.8505,
    lng: -15.8835,
    address: "Jardin public central",
    capacity: 200,
  },
  {
    id: "13",
    name: "Dahira Touba Mosquée",
    type: "dahira",
    lat: 14.844,
    lng: -15.887,
    address: "Quartier Guédé Bousso",
    capacity: 400,
    responsable: "Serigne Abdou Khadre",
    services: ["Hébergement", "Enseignement", "Restauration"],
    visiteurs: 312,
  },
]
