importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

if (!self.define) {
  let e,
    n = {};
  const i = (i, s) => (
    (i = new URL(i + ".js", s).href),
    n[i] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = n), document.head.appendChild(e);
        } else (e = i), importScripts(i), n();
      }).then(() => {
        let e = n[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, r) => {
    const o =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (n[o]) return;
    let c = {};
    const a = (e) => i(e, o),
      l = { module: { uri: o }, exports: c, require: a };
    n[o] = Promise.all(s.map((e) => l[e] || a(e))).then((e) => (r(...e), c));
  };
}
define(["./workbox-70dd0502"], function (e) {
  "use strict";
  self.addEventListener("message", (e) => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [
        { url: "assets/index-H8xRh1_W.js", revision: null },
        { url: "assets/index-koQ6ygmQ.css", revision: null },
        { url: "assets/workbox-window.prod.es5-prqDwDSL.js", revision: null },
        { url: "index.html", revision: "356a0b14bf6cf7f5ea9f1b55763a9124" },
        { url: "favicon.ico", revision: "96efcbd9c4105d9c55855f9764c39a6b" },
        {
          url: "maskable_icon.png",
          revision: "694491e45ca1121171661e247539ce5b",
        },
        {
          url: "android-chrome-192x192.png",
          revision: "fe419589583d38866a372b42b9106ad0",
        },
        {
          url: "android-chrome-512x512.png",
          revision: "35b5c7fb10c3e4e73ee5fc1eaf7b04c8",
        },
        {
          url: "apple-touch-icon.png",
          revision: "096c849ae06c23a7839d741f2da880a5",
        },
        { url: "add.png", revision: "8684a8683d19a9aeb2d89d295c23a99c" },
        { url: "user.png", revision: "88523b7a425fbc5fc718033338781e1f" },
        {
          url: "manifest.webmanifest",
          revision: "08a6ecbb54dffe4c15ffdc904cd0b404",
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))
    ),
    e.registerRoute(
      /.*/,
      new e.NetworkFirst({
        cacheName: "all-cache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 172800 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
      "GET"
    );
});


const firebaseConfig = {
    apiKey: "AIzaSyAiXwnw-mIc8s-DkV2y8JaSwjKa__KF6i8",
    authDomain: "tiendaslocales-7bbf8.firebaseapp.com",
    projectId: "tiendaslocales-7bbf8",
    storageBucket: "tiendaslocales-7bbf8.appspot.com",
    messagingSenderId: "611326584535",
    appId: "1:611326584535:web:0e3aa3aeb59818cbe57292",
    measurementId: "G-4XX5WVVHL0"
  };


const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(payload => {
    console.log("Recibiste un mensaje mientras estabas ausente", payload)
 
    return self.registration.showNotification(payload.data.title, {
        body: payload.data.text,
        icon: 'Client/public/user.png'
      });
})
