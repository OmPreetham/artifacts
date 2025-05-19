const CACHE_NAME = 'artifacts-v1';
const ASSETS_TO_CACHE = [
    '/artifacts/',
    '/artifacts/index.html',
    '/artifacts/manifest.json',
    '/artifacts/icons/favicon-32x32.png',
    '/artifacts/icons/favicon-16x16.png',
    '/artifacts/icons/apple-touch-icon.png',
    '/artifacts/icons/icon-192x192.png',
    '/artifacts/icons/icon-512x512.png',
    '/artifacts/stuff/airplane.png',
    '/artifacts/stuff/ambulance.png',
    '/artifacts/stuff/bedside-table.png',
    '/artifacts/stuff/bell-pepper.png',
    '/artifacts/stuff/broccoli.png',
    '/artifacts/stuff/carrot.png',
    '/artifacts/stuff/city-bus.png',
    '/artifacts/stuff/coffee-table.png',
    '/artifacts/stuff/compact-car.png',
    '/artifacts/stuff/console-table.png',
    '/artifacts/stuff/convertible.png',
    '/artifacts/stuff/corn-on-the-cob.png',
    '/artifacts/stuff/dining-table.png',
    '/artifacts/stuff/eggplant.png',
    '/artifacts/stuff/fire-truck.png',
    '/artifacts/stuff/folding-table.png',
    '/artifacts/stuff/gaming-desk.png',
    '/artifacts/stuff/helicopter.png',
    '/artifacts/stuff/motorcycle.png',
    '/artifacts/stuff/office-desk.png',
    '/artifacts/stuff/peas-in-pod.png',
    '/artifacts/stuff/picnic-table.png',
    '/artifacts/stuff/pickup-truck.png',
    '/artifacts/stuff/red-radish.png',
    '/artifacts/stuff/round-cafe-table.png',
    '/artifacts/stuff/sailboat.png',
    '/artifacts/stuff/scooter.png',
    '/artifacts/stuff/sedan.png',
    '/artifacts/stuff/semi-truck.png',
    '/artifacts/stuff/spinach-leaf.png',
    '/artifacts/stuff/sports-car.png',
    '/artifacts/stuff/tamato.png',
    '/artifacts/stuff/train-locomotive.png',
    '/artifacts/stuff/workbench.png'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch new
                return response || fetch(event.request)
                    .then(response => {
                        // Cache new responses
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    });
            })
    );
}); 