// const CACHE_NAME = "my-app-cache-v1";
// const urlsToCache = ["/", "/index.html", "/manifest.json"];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return (
//         response ||
//         fetch(event.request).then((response) => {
//           const clone = response.clone();
//           caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
//           return response;
//         })
//       );
//     })
//   );
// });



const CACHE_NAME = "pwai-stem-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/js/main.chunk.js",
  "/static/js/bundle.js",
  "/static/css/main.chunk.css",
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
  "https://cdn-icons-png.flaticon.com/512/942/942748.png",
  "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip caching for:
  // 1. Non-GET requests (POST, PUT, DELETE, etc.) - Cache API only supports GET
  // 2. Firebase API requests
  // 3. Other external APIs
  if (
    request.method !== 'GET' ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.pathname.startsWith('/api/')
  ) {
    // For these requests, always fetch from network without caching
    event.respondWith(fetch(request));
    return;
  }
  
  // For GET requests of static assets and app resources, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        // Only cache successful GET requests
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Only cache GET requests with basic response type
        if (request.method === 'GET' && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        // If network fails and it's a navigation request, return cached index.html
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});