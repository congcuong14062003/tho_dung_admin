import { useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRouter";
import DefaultLayout from "./layout/DefaultLayout";

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

  // AppRoutes sẽ tự chọn layout nếu route có chỉ định, còn nếu không thì dùng DefaultLayout
  return <AppRoutes defaultLayout={DefaultLayout} />;
}

export default App;
