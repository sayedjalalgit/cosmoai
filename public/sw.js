const CACHE_NAME = 'cosmoai-v1'

const STATIC_ASSETS = [
  '/',
  '/login',
  '/pricing',
  
]

// Install — cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch — network first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event

  // Skip non-GET and API requests — always fresh
  if (request.method !== 'GET') return
  if (request.url.includes('/api/') || request.url.includes(':8000')) return

  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        // Offline fallback
        return caches.match(request).then(cached => {
          if (cached) return cached
          // If nothing cached, show offline page
          if (request.destination === 'document') {
            return caches.match('/offline')
          }
        })
      })
  )
})
