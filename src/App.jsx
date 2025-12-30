import { useEffect } from "react";
import AppRoutes from "./routes/AppRouter";
import DefaultLayout from "./layout/DefaultLayout";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import { requestForToken, onMessageListener } from "./firebase";

function App() {
  useEffect(() => {
    // Lấy FCM token
    requestForToken().then((token) => {
      if (token) localStorage.setItem("fcm_token", token);
    });
    // Lắng nghe thông báo trong khi đang mở web
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
          autoClose: 10000, // 10 giây cho FCM
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
        autoClose={3000} // 3 giây cho toàn bộ toast mặc định
        theme="colored"
      />

      <Loading />
    </LoadingProvider>
  );
}

export default App;
