import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { token } = useAuth();

  // Nếu đã có token → đẩy về trang chủ
  if (token) return <Navigate to="/" replace />;

  return children;
}
