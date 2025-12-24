import { io } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export const connectSocket = () => {
  const token = Cookies.get("token");
  if (!token) {
    console.warn("⚠ No token → socket NOT connected");
    return null;
  }

  if (socket && socket.connected) {
    // console.log("⚠ Socket already connected:", socket.id);
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ SOCKET ERROR:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
  }
};

export const getSocket = () => socket;
