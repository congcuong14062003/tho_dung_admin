// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCx-pQi4IO5dgI5PK9zX1Nz5uOHsAkr_Xs",
  authDomain: "lux-home-b4445.firebaseapp.com",
  projectId: "lux-home-b4445",
  storageBucket: "lux-home-b4445.firebasestorage.app",
  messagingSenderId: "871071718560",
  appId: "1:871071718560:web:dcb4443c8e21d70ca93dc5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[FCM BACKGROUND]", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // ảnh phải nằm trong public
    data: payload.data
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url;
  if (!url) return;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        client.focus();
        client.navigate(url);
        return;
      }
      return clients.openWindow(url);
    })
  );
});
