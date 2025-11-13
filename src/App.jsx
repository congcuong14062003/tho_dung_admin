import { useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRouter";
import DefaultLayout from "./layout/DefaultLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading/Loading";

function App() {
  const { token } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  // Nếu chưa có token và không ở trang login → về login
  if (!token && !isLoginPage) {
    window.location.href = "/login";
    return null;
  }

  // Nếu có token mà đang ở trang login → sang dashboard
  if (token && isLoginPage) {
    window.location.href = "/";
    return null;
  }

  return (
    <LoadingProvider>
      <AppRoutes defaultLayout={DefaultLayout} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Loading />
    </LoadingProvider>
  );
}

export default App;
