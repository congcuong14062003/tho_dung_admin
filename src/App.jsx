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

  useEffect(() => {
    console.log("📌 Lấy FCM token trước khi login...");
    requestForToken().then((token) => {
      if (token) {
        localStorage.setItem("fcm_token", token);
      }
    });
    onMessageListener().then((payload) => {
      toast.info(
        <div
          onClick={() => {
            if (payload?.data?.url) window.location.href = payload.data.url;
          }}
          style={{ cursor: "pointer" }}
        >
          {payload.notification.title}: {payload.notification.body}
        </div>,
        {
          autoClose: 10000, // ⬅️ riêng cho toast này
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
    });
  }, []);

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
