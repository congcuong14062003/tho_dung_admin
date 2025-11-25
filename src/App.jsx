import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AppRoutes from "./routes/AppRouter";
import DefaultLayout from "./layout/DefaultLayout";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading/Loading";

// Firebase
import { requestForToken, onMessageListener } from "./firebase";

// Socket.IO
import { io } from "socket.io-client";

function App() {
  const { token, user } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  // Redirect logic
  if (!token && !isLoginPage) {
    window.location.href = "/login";
    return null;
  }

  if (token && isLoginPage) {
    window.location.href = "/";
    return null;
  }

  // ============================
  // 🔥 Firebase FCM
  // ============================
  useEffect(() => {
    if (!token) return;

    console.log("📌 Lấy FCM token...");
    requestForToken();

    onMessageListener().then((payload) => {
      toast.info(
        `${payload.notification.title}: ${payload.notification.body}`
      );
    });
  }, [token]);

  // ============================
  // 🔥 Socket.IO
  // ============================
  useEffect(() => {
    if (!token || !user) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    socket.emit("join", user.id || "admin");

    // Nhận realtime request mới
    socket.on("new_request", (data) => {
      toast.info(`🔥 Yêu cầu mới: ${data?.message}`);
    });

    // Nhận cập nhật từ thợ
    socket.on("technician_update", (data) => {
      toast.success(`🛠 Cập nhật: ${data?.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user]);

  return (
    <LoadingProvider>
      <AppRoutes defaultLayout={DefaultLayout} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />

      <Loading />
    </LoadingProvider>
  );
}

export default App;
