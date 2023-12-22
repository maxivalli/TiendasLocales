importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);
import { cacheNames, clientsClaim } from 'workbox-core';
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import {
  NetworkFirst,
  NetworkOnly,
  Strategy
} from 'workbox-strategies';
import { precacheAndRoute } from "workbox-precaching";

const data = {
  race: false,
  debug: false,
  credentials: 'same-origin',
  networkTimeoutSeconds: 0,
  fallback: 'index.html'
};

const cacheName = cacheNames.runtime;

function buildStrategy() {
  if (data.race) {
    class CacheNetworkRace extends Strategy {
      async _handle(request, handler) {
        const fetchAndCachePutDone = handler.fetchAndCachePut(request);
        const cacheMatchDone = handler.cacheMatch(request);

        return new Promise((resolve, reject) => {
          fetchAndCachePutDone.then(resolve).catch((e) => {
            if (data.debug) {
              console.log(`Cannot fetch resource: ${request.url}`, e);
            }
          });
          cacheMatchDone.then(response => response && resolve(response));

          Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
            const [fetchAndCachePutResult, cacheMatchResult] = results;
            if (fetchAndCachePutResult.status === 'rejected' && !cacheMatchResult.value) {
              reject(fetchAndCachePutResult.reason);
            }
          });
        });
      }
    }
    return new CacheNetworkRace();
  } else {
    if (data.networkTimeoutSeconds > 0) {
      return new NetworkFirst({ cacheName, networkTimeoutSeconds: data.networkTimeoutSeconds });
    } else {
      return new NetworkFirst({ cacheName });
    }
  }
}

const manifest = self.__WB_MANIFEST || [];

const cacheEntries = [];

const manifestURLs = manifest.map(
  (entry) => {
    const url = new URL(entry.url, self.location);
    cacheEntries.push(new Request(url.href, {
      credentials: data.credentials
    }));
    return url.href;
  }
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          if (!manifestURLs.includes(request.url)) {
            if (data.debug) {
              console.log(`Checking cache entry to be removed: ${request.url}`);
            }
            cache.delete(request).then((deleted) => {
              if (data.debug) {
                if (deleted) {
                  console.log(`Precached data removed: ${request.url || request}`);
                } else {
                  console.log(`No precache found: ${request.url || request}`);
                }
              }
            });
          }
        });
      });
    })
  );
});

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  buildStrategy()
);

setDefaultHandler(new NetworkOnly());

setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(data.fallback).then((r) => {
        return r ? Promise.resolve(r) : Promise.resolve(Response.error());
      });
    default:
      return Promise.resolve(Response.error());
  }
});

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

const firebaseConfig = {
  apiKey: "AIzaSyAiXwnw-mIc8s-DkV2y8JaSwjKa__KF6i8",
  authDomain: "tiendaslocales-7bbf8.firebaseapp.com",
  projectId: "tiendaslocales-7bbf8",
  storageBucket: "tiendaslocales-7bbf8.appspot.com",
  messagingSenderId: "611326584535",
  appId: "1:611326584535:web:0e3aa3aeb59818cbe57292",
  measurementId: "G-4XX5WVVHL0",
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  console.log("Recibiste un mensaje mientras estabas ausente", payload);

  return self.registration.showNotification(payload.data.title, {
    body: payload.data.text,
    icon: "https://firebasestorage.googleapis.com/v0/b/tiendaslocales-7bbf8.appspot.com/o/logo.png?alt=media&token=bca80e33-79d3-4b7e-8e50-e7cb026a2a58",
    badge: "https://firebasestorage.googleapis.com/v0/b/tiendaslocales-7bbf8.appspot.com/o/badge.png?alt=media&token=b561d310-48e6-4ef3-9f1e-5a0baace738f"
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); 
  
  const url = 'https://tiendaslocales.com.ar'; 
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {

      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
