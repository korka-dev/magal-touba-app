export interface Location {
  id: string
  name: string
  type: "mosquee" | "dahira" | "thiante" | "eau" | "urgence" | "toilette" | "securite" | "boutique" | "repos"
  lat: number
  lng: number
  address: string
  responsable?: string
  capacity?: number
  visiteurs?: number
  services?: string[]
  phone?: string
  horaires?: string
  consignes?: string
}

export const TOUBA_CENTER = {
  lat: 14.8516,
  lng: -15.8777,
}

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Grande Mosquée de Touba",
    type: "mosquee",
    lat: 14.8516,
    lng: -15.8777,
    address: "Centre-ville, Touba",
    capacity: 50000,
    visiteurs: 12500,
    horaires: "Ouvert 24h/24",
    services: ["Ablutions", "Eau potable", "Zone de repos"],
    consignes: "Tenue décente obligatoire. Retirer les chaussures avant d'entrer. Respecter le silence et la prière.",
  },
  {
    id: "2",
    name: "Dahira Matlaboul Fawzaini",
    type: "dahira",
    lat: 14.8556,
    lng: -15.8817,
    address: "Quartier Darou Khoudoss, Touba",
    responsable: "Serigne Abdoulaye Mbacké",
    capacity: 500,
    visiteurs: 150,
    phone: "+221 77 123 45 67",
    services: ["Hébergement", "Restauration", "Eau potable"],
    horaires: "Accueil de 8h à 22h",
    consignes: "Inscription obligatoire à l'arrivée. Respecter les horaires de prière. Pas de visites après 22h.",
  },
  {
    id: "3",
    name: "Thiante Serigne Touba",
    type: "thiante",
    lat: 14.8486,
    lng: -15.8747,
    address: "Avenue Cheikh Ahmadou Bamba, Touba",
    responsable: "Sokhna Fatou Bintou",
    capacity: 300,
    visiteurs: 89,
    phone: "+221 76 234 56 78",
    services: ["Restauration", "Distribution d'eau", "Aire de repos"],
    horaires: "Service de 7h à 21h",
    consignes: "Repas gratuits distribués à 13h et 20h. Apporter ses propres ustensiles si possible.",
  },
  {
    id: "4",
    name: "Point d'eau Darou Salam",
    type: "eau",
    lat: 14.8536,
    lng: -15.8797,
    address: "Quartier Darou Salam, Touba",
    services: ["Eau potable", "Toilettes"],
    horaires: "Accessible 24h/24",
    consignes: "Utiliser les bidons fournis. Ne pas gaspiller l'eau. Maintenir la propreté des lieux.",
  },
  {
    id: "5",
    name: "Poste de Secours Central",
    type: "urgence",
    lat: 14.8506,
    lng: -15.8767,
    address: "Place de l'Indépendance, Touba",
    phone: "+221 33 976 12 34",
    services: ["Premiers secours", "Ambulance", "Médecin sur place"],
    horaires: "Urgences 24h/24",
    consignes: "En cas d'urgence, appeler le numéro ou se présenter directement. Gardez vos documents d'identité.",
  },
  {
    id: "6",
    name: "Dahira Hizbut Tarqiyyah",
    type: "dahira",
    lat: 14.8576,
    lng: -15.8837,
    address: "Quartier Keur Niang, Touba",
    responsable: "Serigne Mbaye Fall",
    capacity: 400,
    visiteurs: 203,
    phone: "+221 70 345 67 89",
    services: ["Hébergement", "Repas", "Bibliothèque"],
    horaires: "Accueil 24h/24",
    consignes: "Réservation recommandée pendant le Magal. Participation aux activités spirituelles encouragée.",
  },
  {
    id: "7",
    name: "Point d'eau Mosquée Massalikoul Jinaan",
    type: "eau",
    lat: 14.8496,
    lng: -15.8757,
    address: "Près de Massalikoul Jinaan, Touba",
    services: ["Eau potable gratuite", "Zone d'ablutions"],
    horaires: "24h/24",
    consignes: "Faire la queue dans l'ordre. Eau uniquement pour usage personnel et ablutions.",
  },
  {
    id: "8",
    name: "Thiante Mame Diarra Bousso",
    type: "thiante",
    lat: 14.8546,
    lng: -15.8807,
    address: "Avenue Serigne Fallou, Touba",
    responsable: "Sokhna Mariama Niasse",
    capacity: 250,
    visiteurs: 167,
    phone: "+221 77 456 78 90",
    services: ["Distribution de repas", "Boissons chaudes", "Aire de repos"],
    horaires: "De 6h à 23h",
    consignes: "Distribution de petit-déjeuner à 7h, déjeuner à 13h30 et dîner à 20h. Venir avec sa propre gamelle.",
  },
]