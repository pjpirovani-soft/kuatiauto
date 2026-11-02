const CACHE_NAME = 'kuatiauto-v2'; // Cambiamos la versión para forzar actualización
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
  // Ya no cacheamos '/' para que el HTML siempre esté fresco
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting(); // Fuerza la activación inmediata
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Si es una página (HTML), siempre buscar en la red primero
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/'); // Fallback offline (aunque no lo cacheamos, por si acaso)
      })
    );
    return;
  }

  // Para el resto (imágenes, etc.), usar caché
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
