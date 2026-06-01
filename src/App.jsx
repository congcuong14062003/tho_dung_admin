import { useEffect } from "react";
import AppRoutes from "./routes/AppRouter";
import DefaultLayout from "./layout/DefaultLayout";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading/Loading";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { NotificationProvider } from "./context/NotificationContext";
import FCMListener from "./components/FCMListener";
import { useDispatch } from "react-redux";

// 🔥 FIX import Redux
import userApi from "./service/api/userApi";
import { logout, setUser } from "./context/AuthContext";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const handleGetInfor = async () => {
      try {
        const res = await userApi.getMe();

        if (res.status === 200 || res.status === true) {
          // 🔥 lấy user từ API, KHÔNG phải token
          dispatch(setUser(res?.data?.userInfor));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("GetMe error:", error);
        dispatch(logout());
      }
    };

    handleGetInfor();
  }, [dispatch]);

  return (
    <LoadingProvider>
      <NotificationProvider>
        <FCMListener />
        <AppRoutes defaultLayout={DefaultLayout} />
        <ToastContainer position="top-right" theme="colored" />
        <Loading />
      </NotificationProvider>
    </LoadingProvider>
  );
}

export default App;
