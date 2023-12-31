importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);
import { registerRoute } from "workbox-routing";
import { NetworkFirst, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

registerRoute(
  /^((?!https:\/\/api-chat-engine-io).)*$/,
  new NetworkFirst({
    cacheName: "TL-all-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
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

  return self.registration.showNotification(payload.data.title, {
    body: payload.data.text,
    icon: "https://firebasestorage.googleapis.com/v0/b/tiendaslocales-7bbf8.appspot.com/o/logo.png?alt=media&token=bca80e33-79d3-4b7e-8e50-e7cb026a2a58",
    badge: "https://firebasestorage.googleapis.com/v0/b/tiendaslocales-7bbf8.appspot.com/o/BadgeOK.png?alt=media&token=c0d844a3-9e9f-432c-a848-8f66e272dbbb",
    actions: [
      { action: "close", title: "Cerrar" },
    ],
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = "https://www.tiendaslocales.com.ar";

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
