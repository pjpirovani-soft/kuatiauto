const CACHE_NAME = 'kuatiauto-v3';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
];

// Instalar: cachear assets y NO hacer skipWaiting (esperar confirmación del cliente)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  // NO llamamos a skipWaiting() acá. Esperamos que el cliente lo pida.
});

// Activar: limpiar caches viejos y tomar control
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

// Escuchar mensajes del cliente (para actualizar cuando el usuario lo pida)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch: HTML siempre de la red, resto de caché
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Si es una página (HTML), siempre buscar en la red primero
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/');
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