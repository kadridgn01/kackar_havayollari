// Service Worker (bilet-sw.js)
const CACHE_NAME = 'bilet-cache-v1';
const urlsToCache = [
  'bilet.html',
  'bilet-manifest.json',
  'https://cdn.tailwindcss.com'
];

// 1. Install (Yükleme) Aşaması: Cache'i oluştur ve dosyaları ekle
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Bilet cache açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch (Getirme) Aşaması: Önce cache'e bak, yoksa network'e git
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache'de varsa, cache'den döndür
        }
        return fetch(event.request); // Cache'de yoksa, network'ten al
      }
    )
  );
});

// 3. Activate (Aktifleştirme) Aşaması: Eski cache'leri temizle
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
