importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
      .register("../firebase-messaging-sw.js")
      .then(function (registration) {
          console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function (err) {
          console.log("Service worker registration failed, error:", err);
      });
}

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
