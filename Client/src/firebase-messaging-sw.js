importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

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
    tag: 'Tiendas Locales',
    icon: './assets/logo.png'
  });
});
