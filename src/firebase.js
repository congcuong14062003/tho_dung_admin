// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCx-pQi4IO5dgI5PK9zX1Nz5uOHsAkr_Xs",
  authDomain: "lux-home-b4445.firebaseapp.com",
  projectId: "lux-home-b4445",
  storageBucket: "lux-home-b4445.firebasestorage.app",
  messagingSenderId: "871071718560",
  appId: "1:871071718560:web:dcb4443c8e21d70ca93dc5",
  measurementId: "G-B7T819QJ0N"
};
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Lấy token FCM
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BGNVPCwCjDMXOSdB7vmTPBJwSSwt4O_wrPNG15-TV6HyfgnOI_o9xac6eipku56lHUB7MVKkQFAX0wG1HiXzEgs",
    });

    console.log("FCM Token CMS:", token);
    return token;
  } catch (error) {
    console.error("Lỗi lấy FCM token:", error);
  }
};

// Lắng nghe thông báo khi CMS đang mở
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
