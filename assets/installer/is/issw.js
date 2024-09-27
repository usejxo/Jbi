const CACHE_NAME = 'Jblox_Cache';

// Install service worker and open the cache
self.addEventListener('install', event => {
    // Activate immediately after installation without waiting for the page to reload
    self.skipWaiting();
});

// Cache everything on fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the request is in the cache, return the cached response
                if (response) {
                    return response;
                }

                // Otherwise, fetch it from the network and cache it for future use
                return fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        // Clone the response and store it in the cache
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            }).catch(() => {
                // If both the network and cache fail, you can provide a fallback here (optional)
                // return caches.match('/offline.html'); // Serve an offline page if needed
            })
    );
});

// Update the service worker and remove old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
