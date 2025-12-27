let googleMapsPromise: Promise<void> | null = null

export async function loadGoogleMapsScript(): Promise<void> {
  // Si déjà chargé
  if (typeof window !== "undefined" && (window as any).google?.maps) {
    console.log("[v0] Google Maps déjà chargé")
    return Promise.resolve()
  }

  // Si déjà en cours de chargement
  if (googleMapsPromise) {
    console.log("[v0] Chargement de Google Maps en cours...")
    return googleMapsPromise
  }

  // Charger le script
  googleMapsPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window n'est pas disponible"))
      return
    }

    // Vérifier si le script existe déjà
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')

    if (existingScript) {
      console.log("[v0] Script Google Maps trouvé, attente du chargement...")
      const checkInterval = setInterval(() => {
        if ((window as any).google?.maps) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkInterval)
        if (!(window as any).google?.maps) {
          reject(new Error("Timeout: Google Maps n'a pas pu être chargé"))
        }
      }, 10000)
      return
    }

    // Créer un nouveau script
    const script = document.createElement("script")
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

    if (!apiKey) {
      reject(new Error("Clé API Google Maps manquante"))
      return
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      console.log("[v0] Google Maps script chargé avec succès")
      resolve()
    }

    script.onerror = () => {
      console.error("[v0] Erreur lors du chargement du script Google Maps")
      reject(new Error("Erreur lors du chargement de Google Maps"))
    }

    document.head.appendChild(script)
  })

  return googleMapsPromise
}

