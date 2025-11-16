const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `photography-portfolio-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `photography-images-${CACHE_VERSION}`;

const CACHE_DURATION = {
  pages: 86400,    // 24h
  assets: 604800,  // 7 jours
  images: 2592000  // 30 jours
};

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/output.css',
  '/js/optimization/image-optimizer.js',
  '/js/optimization/lightbox-optimizer.js',
  '/js/optimization/sw-register.js',
  '/js/images-config.js',
  '/js/i18n.js',
  '/js/fade_in.js',
  '/js/menu.js',
  '/js/scroll-to-top.js',
  '/js/portfolio-layout.js'
];

const PAGES = [
  '/pages/about_me.html',
  '/pages/contact.html',
  '/pages/portfolio/showcase.html',
  '/pages/portfolio/nature.html',
  '/pages/portfolio/portraits.html',
  '/pages/portfolio/sport.html',
  '/pages/portfolio/evenements.html',
  '/pages/portfolio/animaux.html',
  '/pages/portfolio/personnel.html'
];

const COMPONENTS = [
  '/components/navbar.html',
  '/components/footer.html',
  '/components/scroll-to-top.html',
  '/components/language-toggle.html'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing version', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll([...STATIC_ASSETS, ...PAGES, ...COMPONENTS].map(url => {
          return new Request(url, { cache: 'reload' });
        })).catch(err => console.error('[SW] Cache failed:', err));
      }),
      caches.open(IMAGE_CACHE_NAME)
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (!url.protocol.startsWith('http') || url.origin !== location.origin) {
    return;
  }
  
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAssetRequest(request));
  } else {
    event.respondWith(handleDefaultRequest(request));
  }
});

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/assets/images/') ||
         url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

function isPageRequest(request) {
  return request.mode === 'navigate' || 
         request.destination === 'document' ||
         request.url.endsWith('.html');
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/i);
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const cachedTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0).getTime();
    const now = Date.now();
    
    if (now - cachedTime < CACHE_DURATION.images * 1000) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cache-time', new Date().toISOString());
      
      const modifiedResponse = new Response(await responseToCache.blob(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) return cachedResponse;
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function handlePageRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
    
    return new Response(
      `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Hors ligne</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
          }
          h1 { font-size: 2.5rem; margin-bottom: 1rem; }
          p { font-size: 1.2rem; margin-bottom: 2rem; }
          button {
            background: white;
            color: #667eea;
            border: none;
            padding: 1rem 2rem;
            font-size: 1rem;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s;
          }
          button:hover { transform: scale(1.05); }
        </style>
      </head>
      <body>
        <div>
          <h1>📡 Vous êtes hors ligne</h1>
          <p>Cette page n'est pas disponible en mode hors ligne.</p>
          <button onclick="window.history.back()">← Retour</button>
        </div>
      </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 503 }
    );
  }
}

async function handleStaticAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
    }).catch(() => {});
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
    throw error;
  }
}

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ size });
      })
    );
  }
});

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

console.log('[SW] Loaded version', CACHE_VERSION);
