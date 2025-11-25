importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCx-pQi4IO5dgI5PK9zX1Nz5uOHsAkr_Xs",
  authDomain: "lux-home-b4445.firebaseapp.com",
  projectId: "lux-home-b4445",
  storageBucket: "lux-home-b4445.firebasestorage.app",
  messagingSenderId: "871071718560",
  appId: "1:871071718560:web:dcb4443c8e21d70ca93dc5",
  measurementId: "G-B7T819QJ0N"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png"
  });
});
