const CACHE_NAME = "magal-touba-v1"
const urlsToCache = ["/", "/manifest.json", "/images/logo-magal.jpg"]

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[v0] Service Worker: Caching files")
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[v0] Service Worker: Clearing old cache")
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Cache new resources
            return caches.open(CACHE_NAME).then((cache) => {
              if (event.request.method === "GET") {
                cache.put(event.request, fetchResponse.clone())
              }
              return fetchResponse
            })
          })
        )
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === "document") {
          return caches.match("/")
        }
      }),
  )
})

