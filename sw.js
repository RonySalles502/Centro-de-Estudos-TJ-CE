// Service Worker — Centro de Estudos TJ-CE 2026
// Estratégia: cache-first para assets locais, network-first para CDNs (com fallback ao cache).
// Bump CACHE_VERSION quando publicar mudanças significativas no HTML.

const CACHE_VERSION = 'tjce-v1';
const CACHE_NAME = `tjce-cache-${CACHE_VERSION}`;

// Assets locais que devem ficar disponíveis offline assim que possível.
// Importante: os caminhos são relativos ao escopo do SW (pasta onde sw.js está).
const ASSETS_LOCAIS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

// CDNs externos que o app usa em runtime (React, Tailwind, Babel).
// Vão para o cache na primeira visita. Não pré-cacheamos para não falhar a instalação por causa de CORS.
const CDNS_RUNTIME = [
  'https://unpkg.com/react@18/',
  'https://unpkg.com/react-dom@18/',
  'https://unpkg.com/@babel/standalone/',
  'https://cdn.tailwindcss.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Adiciona individualmente para não falhar tudo se um único asset falhar
    await Promise.all(ASSETS_LOCAIS.map(async (url) => {
      try { await cache.add(url); } catch (e) { /* ignora */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Limpa caches antigos
    const nomes = await caches.keys();
    await Promise.all(nomes.filter(n => n.startsWith('tjce-cache-') && n !== CACHE_NAME).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const ehCdnRuntime = CDNS_RUNTIME.some(prefix => req.url.startsWith(prefix));
  const ehMesmaOrigem = url.origin === self.location.origin;

  if (ehMesmaOrigem) {
    // Cache-first para assets locais (HTML, manifest, ícones)
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) {
        // Refresh em background (stale-while-revalidate light)
        fetch(req).then(resp => { if (resp && resp.ok) cache.put(req, resp.clone()); }).catch(()=>{});
        return cached;
      }
      try {
        const resp = await fetch(req);
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      } catch (e) {
        // Fallback: serve a página principal se for navegação
        if (req.mode === 'navigate') {
          const fallback = await cache.match('./index.html');
          if (fallback) return fallback;
        }
        throw e;
      }
    })());
    return;
  }

  if (ehCdnRuntime) {
    // Network-first para CDNs, com fallback ao cache (deixa CDN servir o mais recente)
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const resp = await fetch(req);
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      } catch (e) {
        const cached = await cache.match(req);
        if (cached) return cached;
        throw e;
      }
    })());
    return;
  }

  // Outros recursos: passa direto (sem cache)
});
