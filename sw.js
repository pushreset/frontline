'use strict';
// Offline play for the installed app (PWA). Network first: online, the game is always the latest version;
// offline, it falls back on the copies kept from the last visits. No file list to maintain: whatever the
// game loads gets cached on the way.
const CACHE = 'ldf';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('./') : undefined))
    .then(hit => hit || Response.error())));
});
