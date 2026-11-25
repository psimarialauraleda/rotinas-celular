// Guarda o "casco" do app para abrir mesmo sem internet. Os dados nunca passam por aqui (ficam no aparelho e no Supabase).
const CACHE = 'rotinas-v1'
self.addEventListener('install', (e) => { self.skipWaiting() })
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return
  e.respondWith(
    fetch(req).then((res) => { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); return res })
      .catch(() => caches.match(req).then((r) => r || caches.match('./')))
  )
})
