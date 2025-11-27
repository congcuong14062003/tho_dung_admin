import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
});

export default socket;
