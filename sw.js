const CACHE_NAME = 'artifacts-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/favicon-32x32.png',
    '/icons/favicon-16x16.png',
    '/icons/apple-touch-icon.png',
    '/stuff/airplane.png',
    '/stuff/carrot.png',
    '/stuff/coffee-table.png',
    '/stuff/sailboat.png',
    '/stuff/ambulance.png',
    '/stuff/bedside-table.png',
    '/stuff/bell-pepper.png',
    '/stuff/broccoli.png',
    '/stuff/city-bus.png',
    '/stuff/compact-car.png',
    '/stuff/console-table.png',
    '/stuff/convertible.png',
    '/stuff/corn-on-the-cob.png',
    '/stuff/dining-table.png',
    '/stuff/eggplant.png',
    '/stuff/fire-truck.png',
    '/stuff/folding-table.png',
    '/stuff/gaming-desk.png',
    '/stuff/helicopter.png',
    '/stuff/motorcycle.png',
    '/stuff/office-desk.png',
    '/stuff/peas-in-pod.png',
    '/stuff/picnic-table.png',
    '/stuff/pickup-truck.png',
    '/stuff/red-radish.png',
    '/stuff/round-cafe-table.png',
    '/stuff/scooter.png',
    '/stuff/sedan.png',
    '/stuff/semi-truck.png',
    '/stuff/spinach-leaf.png',
    '/stuff/sports-car.png',
    '/stuff/tamato.png',
    '/stuff/train-locomotive.png',
    '/stuff/workbench.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request because it can only be used once
                const fetchRequest = event.request.clone();

                // Make network request and cache the response
                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response because it can only be used once
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
}); 