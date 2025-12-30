// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCx-pQi4IO5dgI5PK9zX1Nz5uOHsAkr_Xs",
  authDomain: "lux-home-b4445.firebaseapp.com",
  projectId: "lux-home-b4445",
  storageBucket: "lux-home-b4445.firebasestorage.app",
  messagingSenderId: "871071718560",
  appId: "1:871071718560:web:dcb4443c8e21d70ca93dc5",
};

const app = initializeApp(firebaseConfig);
const isSecure =
  location.protocol === "https:" || location.hostname === "localhost";

export const messaging = isSecure ? getMessaging(app) : null;

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const swReg = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey:
        "BGNVPCwCjDMXOSdB7vmTPBJwSSwt4O_wrPNG15-TV6HyfgnOI_o9xac6eipku56lHUB7MVKkQFAX0wG1HiXzEgs",
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      localStorage.setItem("fcm_token", token);
      console.log("🔥 NEW TOKEN:", token);
    }
    return token;
  } catch (err) {
    console.error("❌ Lỗi lấy token:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => onMessage(messaging, resolve));
export const removeFcmToken = async () => {
  try {
    const currentToken = localStorage.getItem("fcm_token");
    if (!currentToken) return;

    await deleteToken(messaging); // 🔥 XÓA TOKEN TRONG FIREBASE
    localStorage.removeItem("fcm_token");

    console.log("🗑️ Đã xóa FCM token trên client:", currentToken);
  } catch (error) {
    console.error("❌ Lỗi xóa token FCM:", error);
  }
};
