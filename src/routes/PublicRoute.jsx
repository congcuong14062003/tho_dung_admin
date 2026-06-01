import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  // 🔥 Lấy token từ Redux
  const token = useSelector((state) => state.auth.token);

  // Nếu đã login → redirect về home
  if (token) return <Navigate to="/" replace />;

  return children;
}
