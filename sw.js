// Simple offline-first service worker (cache the app shell)
const CACHE = 'parking-gent-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  // network-first for API, cache-first for app shell
  if (url.hostname.includes('opendatasoft.com')) {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
  }
});
