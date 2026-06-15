const CACHE_NAME = 'green-house-v1';

// Installazione - Non cachare nulla all'inizio
self.addEventListener('install', (event) => {
  console.log('[SW] ✅ Service Worker installato');
  self.skipWaiting();
});

// Attivazione - Pulisci cache vecchie
self.addEventListener('activate', (event) => {
  console.log('[SW] ✅ Service Worker attivato');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] 🗑️ Eliminazione cache vecchia:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Strategia Network First (prova rete, poi cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se la risposta è valida, salvala in cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se la rete fallisce, prova dalla cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se non c'è nemmeno in cache, ritorna una risposta di fallback
          return new Response('Offline - Contenuto non disponibile', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Notifiche Push
self.addEventListener('push', (event) => {
  console.log('[SW] 📬 Notifica push ricevuta');
  
  const title = 'Green House 🏠';
  const options = {
    body: event.data ? event.data.text() : 'Controlla le tue piante!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'plant-notification',
    requireInteraction: false,
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Click sulla notifica
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 🖱️ Click su notifica');
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se c'è già una finestra aperta, portala in primo piano
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Altrimenti apri una nuova finestra
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Gestione errori
self.addEventListener('error', (event) => {
  console.error('[SW] ❌ Errore:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] ❌ Promise rejection:', event.reason);
});

console.log('[SW] 🚀 Service Worker caricato');
