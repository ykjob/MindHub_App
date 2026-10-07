// Web export only. No caching, user-data access or outbound data transmission.
// Pages cannot set COOP/COEP; add them to same-origin responses for SQLite WASM.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    let response = await fetch(event.request);
    // Serve the SPA with HTTP 200 when reloading a dynamic/local-data route.
    if (event.request.mode === 'navigate' && response.status === 404) {
      response = await fetch(new URL('index.html', self.registration.scope));
    }
    if (response.status === 0) return response;
    const headers = new Headers(response.headers);
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    return new Response(response.body, {
      status: response.status, statusText: response.statusText, headers,
    });
  })());
});
