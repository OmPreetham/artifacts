const CACHE_NAME = 'artifacts-v2';
const ASSETS_TO_CACHE = [
    '/artifacts/',
    '/artifacts/index.html',
    '/artifacts/manifest.json',
    '/artifacts/sw.js',
    '/artifacts/public/logo.jpeg'
];

// Add all icon files to cache
const ICON_FILES = [
    'airplane', 'carrot', 'coffee-table', 'sailboat', 'ambulance',
    'bedside-table', 'bell-pepper', 'broccoli', 'city-bus', 'compact-car',
    'console-table', 'convertible', 'corn-on-the-cob', 'dining-table',
    'eggplant', 'fire-truck', 'folding-table', 'gaming-desk', 'helicopter',
    'motorcycle', 'office-desk', 'peas-in-pod', 'picnic-table', 'pickup-truck',
    'red-radish', 'round-cafe-table', 'scooter', 'sedan', 'semi-truck',
    'spinach-leaf', 'sports-car', 'tamato', 'train-locomotive', 'workbench',
    'acerola-barbados-cherry', 'aibu', 'apple', 'apricot', 'asian-pear',
    'atemoya', 'avacado', 'banana', 'beal', 'bilberries', 'blackberry',
    'blackcurrants', 'boysenberry', 'brazilian-guava', 'breadfruit',
    'cactus-pear-prickly-pear', 'cantaloupe', 'citron', 'clemntine',
    'cupuacu', 'red-cherries', 'red-cranberries', 'red-currants'
];

ICON_FILES.forEach(icon => {
    ASSETS_TO_CACHE.push(`/artifacts/stuff/${icon}.png`);
});

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('Cache failed:', error);
            })
    );
    // Activate the new service worker immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Take control of all clients as soon as it activates
            clients.claim(),
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

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
                            })
                            .catch(error => {
                                console.error('Cache put failed:', error);
                            });

                        return response;
                    }
                ).catch(error => {
                    console.error('Fetch failed:', error);
                    // Return a fallback response if available
                    return caches.match('/artifacts/offline.html');
                });
            })
    );
}); 