importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

registerRoute(
  /(.*)/,
  new NetworkFirst({
    cacheName: "all-cache",
    plugins: [
      new ExpirationPlugin({
        maxSize: 400 * 1024 * 1024,
      }),
      {
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    ],
  })
);

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
    badge:
      "https://firebasestorage.googleapis.com/v0/b/tiendaslocales-7bbf8.appspot.com/o/badge.png?alt=media&token=cb641376-612e-4760-801a-a6ea969b6f8e",
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = "https://tiendaslocales.com.ar";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
